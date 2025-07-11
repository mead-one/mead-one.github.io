(function() {
  "use strict";
  class Project {
    constructor(appId, appTitle, container) {
      this.appId = appId;
      this.appTitle = appTitle;
      this.container = container;
      this.container.innerHTML = "";
      this.titlebar = this.buildTitlebar();
      this.container.appendChild(this.titlebar);
      this.content = document.createElement("div");
      this.content.setAttribute("id", `${this.appId}-content`);
      this.content.classList.add("project-content");
      this.container.appendChild(this.content);
    }
    buildTitlebar() {
      const titlebar = document.createElement("div");
      titlebar.classList.add("project-title-bar");
      const titlebarIcon = document.createElement("img");
      titlebarIcon.classList.add("project-window-icon");
      titlebarIcon.height = 18;
      titlebarIcon.setAttribute("src", `/img/${this.appId}-icon.png`);
      titlebar.appendChild(titlebarIcon);
      const titlebarTitle = document.createElement("h2");
      titlebarTitle.innerText = this.appTitle;
      titlebar.appendChild(titlebarTitle);
      const titlebarControls = document.createElement("span");
      titlebarControls.classList.add("project-window-controls");
      const titlebarMinimiseChk = document.createElement("input");
      titlebarMinimiseChk.type = "checkbox";
      titlebarMinimiseChk.setAttribute("id", `${this.appId}-minimise`);
      titlebarMinimiseChk.setAttribute("hidden", "");
      titlebarMinimiseChk.classList.add("project-window-minimise");
      titlebarMinimiseChk.addEventListener("change", (e) => {
        const checkbox = e.target;
        const projectWindow = this.container;
        if (!checkbox || !projectWindow) {
          console.error("Missing checkbox or project window.");
          return;
        }
        const maximiseButton = projectWindow.querySelector(".project-window-maximise");
        const content = projectWindow.querySelector(".project-content");
        if (!maximiseButton || !content) {
          return;
        }
        if (maximiseButton.checked) {
          maximiseButton.checked = false;
          projectWindow.classList.remove("maximised");
        }
        if (checkbox.checked) {
          this.container.classList.add("minimised");
          content.classList.add("minimised");
        } else {
          this.container.classList.remove("minimised");
          content.classList.remove("minimised");
        }
      });
      titlebarControls.appendChild(titlebarMinimiseChk);
      const titlebarMinimiseLbl = document.createElement("label");
      titlebarMinimiseLbl.htmlFor = `${this.appId}-minimise`;
      titlebarMinimiseLbl.classList.add("project-minimise-btn");
      titlebarControls.appendChild(titlebarMinimiseLbl);
      const titlebarMinimiseImg = document.createElement("img");
      titlebarMinimiseImg.src = "/img/minimise-btn.png";
      titlebarMinimiseImg.width = 16;
      titlebarMinimiseImg.height = 16;
      titlebarMinimiseLbl.appendChild(titlebarMinimiseImg);
      const titlebarMaximiseChk = document.createElement("input");
      titlebarMaximiseChk.type = "checkbox";
      titlebarMaximiseChk.setAttribute("id", `${this.appId}-maximise`);
      titlebarMaximiseChk.setAttribute("hidden", "");
      titlebarMaximiseChk.classList.add("project-window-maximise");
      titlebarMaximiseChk.addEventListener("change", (e) => {
        const checkbox = e.target;
        const projectWindow = this.container;
        const minimiseButton = projectWindow.querySelector(".project-window-minimise");
        const content = projectWindow.querySelector(".project-content");
        if (!checkbox || !projectWindow || !minimiseButton || !content) {
          console.error("No project window or minimise button found.");
          return;
        }
        if (minimiseButton.checked) {
          minimiseButton.checked = false;
          content.classList.remove("minimised");
        }
        if (checkbox.checked) {
          projectWindow.classList.add("maximised");
        } else {
          projectWindow.classList.remove("maximised");
        }
      });
      titlebarControls.appendChild(titlebarMaximiseChk);
      const titlebarMaximiseLbl = document.createElement("label");
      titlebarMaximiseLbl.htmlFor = `${this.appId}-maximise`;
      titlebarMaximiseLbl.classList.add("project-maximise-btn");
      titlebarControls.appendChild(titlebarMaximiseLbl);
      const titlebarMaximiseImg = document.createElement("img");
      titlebarMaximiseImg.src = "/img/maximise-btn.png";
      titlebarMaximiseImg.width = 16;
      titlebarMaximiseImg.height = 16;
      titlebarMaximiseLbl.appendChild(titlebarMaximiseImg);
      const titlebarCloseImg = document.createElement("img");
      titlebarCloseImg.src = "/img/close-btn.png";
      titlebarCloseImg.classList.add("project-window-close");
      titlebarCloseImg.width = 16;
      titlebarCloseImg.height = 16;
      titlebarControls.appendChild(titlebarCloseImg);
      titlebar.appendChild(titlebarControls);
      return titlebar;
    }
  }
  document.addEventListener("DOMContentLoaded", initialise);
  const DEFAULT_CANVAS_MARGIN = 50;
  const DEFAULT_ARCH_CONFIG = {
    type: "flat",
    opening: 800,
    height: 210,
    jointSize: 10,
    brickDivisionMethod: "width",
    brickWidth: 65,
    skewUnit: "deg",
    skew: 20,
    baseRise: 0,
    topRise: 0
  };
  const TOOLBAR_FIELDS = [
    {
      id: "arch-type-toolbar-select",
      name: "type",
      label: "Arch type:",
      type: "select",
      defaultValue: DEFAULT_ARCH_CONFIG.type,
      options: [
        { value: "flat", label: "Flat" },
        { value: "radial", label: "Radial" },
        { value: "semicircle", label: "Semicircle" },
        { value: "bullseye", label: "Bullseye" }
      ],
      visibleFor: ["flat", "radial", "semicircle", "bullseye"]
    },
    {
      id: "brick-width-or-count-input",
      name: "brick-width-or-count",
      label: "Brick width:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.brickWidth,
      visibleFor: ["flat", "radial", "semicircle", "bullseye"],
      additional: [
        {
          id: "brick-division-toolbar-select",
          name: "brick-division-select",
          label: "",
          type: "select",
          defaultValue: DEFAULT_ARCH_CONFIG.brickDivisionMethod,
          options: [
            { value: "width", label: "mm wide" },
            { value: "count", label: "bricks" }
          ]
        }
      ],
      min: 1
    },
    {
      id: "joint-size-toolbar-item",
      name: "joint-size",
      label: "Joint size:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.jointSize,
      visibleFor: ["flat", "radial", "semicircle", "bullseye"],
      min: 1
    },
    {
      id: "opening-toolbar-item",
      name: "opening",
      label: "Opening:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.opening,
      visibleFor: ["flat", "radial", "semicircle", "bullseye"],
      min: 100,
      step: 50
    },
    {
      id: "height-toolbar-item",
      name: "height",
      label: "Height:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.height,
      visibleFor: ["flat", "radial", "semicircle", "bullseye"],
      min: 50,
      step: 5
    },
    {
      id: "skew-toolbar-item",
      name: "skew",
      label: "Skew:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.skew,
      visibleFor: ["flat"],
      min: 1,
      additional: [
        {
          id: "skew-units-toolbar-select",
          name: "skew-units-select",
          label: "",
          type: "select",
          defaultValue: DEFAULT_ARCH_CONFIG.skewUnit,
          options: [
            { value: "deg", label: "°" },
            { value: "mm", label: "mm" }
          ]
        }
      ]
    },
    {
      id: "base-rise-toolbar-item",
      name: "base-rise",
      label: "Base rise:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.baseRise,
      visibleFor: ["flat"],
      min: 0
    },
    {
      id: "top-rise-toolbar-item",
      name: "top-rise",
      label: "Top rise:",
      type: "number",
      defaultValue: DEFAULT_ARCH_CONFIG.topRise,
      visibleFor: ["flat"],
      min: 0
    },
    {
      id: "rise-or-skew-toolbar-item",
      name: "rise-or-skew",
      label: "Rise:",
      type: "number",
      defaultValue: 10,
      visibleFor: ["radial"],
      additional: [
        {
          id: "rise-or-skew-toolbar-select",
          name: "rise-or-skew-select",
          label: "",
          type: "select",
          defaultValue: "rise",
          options: [
            { value: "rise", label: "Rise (mm)" },
            { value: "deg", label: "Skew (°)" },
            { value: "mm", label: "Skew (mm)" }
          ]
        }
      ],
      min: 1
    }
  ];
  function initialise() {
    const container = document.getElementById("brick-arch-container");
    if (!container || !(container instanceof HTMLDivElement)) {
      console.error("No div with id 'brick-arch-container'!");
      throw new Error("No div with id 'brick-arch-container'!");
    }
    globalThis.Arch = new Arch(container);
  }
  class GeometryUtils {
    degToRad(deg) {
      return deg * (Math.PI / 180);
    }
    radToDeg(rad) {
      return rad * (180 / Math.PI);
    }
    // Cast a distance at an angle from a point
    calculateEndpoint(originX, originY, distance, angle) {
      let pointX = originX + distance * Math.cos(angle);
      let pointY = originY + distance * Math.sin(angle);
      return [pointX, pointY];
    }
    // Conversion between lengths of chord and arc, using radius
    arcLengthToChordLength(arcLength, radius) {
      return 2 * radius * Math.sin(arcLength / (2 * radius));
    }
    chordLengthToArcLength(chord, radius) {
      return 2 * radius * Math.asin(chord / (2 * radius));
    }
    // Conversion between arc angle and arc Length
    arcAngleToArcLength(angle, radius) {
      return angle * radius;
    }
    arcLengthToArcAngle(arcLength, radius) {
      return arcLength / radius;
    }
    // Conversion between lengths of arc and tangent, using radius
    arcLengthToTangentLength(arcLength, radius) {
      return radius * Math.tan(arcLength / radius);
    }
    tangentLengthToArcLength(tangent, radius) {
      return radius * Math.atan(tangent / radius);
    }
  }
  class ArchCalculator {
    constructor() {
      this.geometry = new GeometryUtils();
    }
    // Count number of bricks from maximum length of piece, length of joint between, and whether to include last joint
    // (for bullseye arches)
    countBricks(fullLength, maxLength, jointWidth, includeLastJoint) {
      if (typeof includeLastJoint === "undefined" || !includeLastJoint) {
        fullLength += jointWidth;
      }
      return Math.ceil(fullLength / (maxLength + jointWidth));
    }
  }
  class FlatArchCalculator extends ArchCalculator {
    constructor() {
      super();
    }
    calculateParameters(config) {
      if (!config.skew) {
        throw new Error("Missing skew value");
      }
      let skewLength, skewAngle, baseFullAngle;
      switch (config.skewUnit) {
        case "deg":
          skewAngle = this.geometry.degToRad(config.skew);
          skewLength = this.degToLength(config.skew, config.height);
          break;
        case "mm":
          skewLength = config.skew;
          skewAngle = this.lengthToRad(config.skew, config.height);
          break;
        default:
          throw new Error(`Unrecognised skew unit: ${config.skewUnit}`);
      }
      let fullLength = config.opening + 2 * skewLength;
      let baseRadius, baseOrigin;
      if (config.baseRise && config.baseRise > 0) {
        baseRadius = ((config.opening / 2) ** 2 / config.baseRise + config.baseRise) / 2;
        baseOrigin = [fullLength / 2, config.baseRise - baseRadius];
        Math.atan(config.opening / 2 / (baseRadius - config.baseRise));
        baseFullAngle = this.geometry.arcLengthToArcAngle(config.opening, baseRadius);
      } else {
        baseRadius = baseOrigin = baseFullAngle = null;
      }
      let topRadius, topOrigin;
      if (config.topRise && config.topRise > 0) {
        topRadius = ((fullLength / 2) ** 2 / config.topRise + config.topRise) / 2;
        topOrigin = [fullLength / 2, config.height + config.topRise - topRadius];
        Math.atan(fullLength / 2 / (topRadius - config.topRise));
      } else {
        topRadius = topOrigin = null;
      }
      let brickCount, topFullAngle, topBrickAngle, topBrickWidth, topJointAngle, topFullArcLength, topJointArcLength;
      switch (config.brickDivisionMethod) {
        case "width":
          if (!config.brickWidth) throw new Error("Missing brick width");
          if (config.topRise && config.topRise <= 0 || !topRadius) {
            brickCount = this.countBricks(fullLength, config.brickWidth, config.jointSize, false);
            if (brickCount % 2 === 0) {
              brickCount++;
            }
            let justBricks = fullLength - config.jointSize * (brickCount - 1);
            topBrickWidth = justBricks / brickCount;
            topBrickAngle = topJointAngle = topFullArcLength = topJointArcLength = null;
          } else {
            topFullArcLength = this.geometry.chordLengthToArcLength(fullLength, topRadius);
            topJointArcLength = this.geometry.chordLengthToArcLength(config.jointSize, topRadius);
            let maxBrickArcLength = this.geometry.tangentLengthToArcLength(config.brickWidth, topRadius);
            brickCount = this.countBricks(topFullArcLength, maxBrickArcLength, topJointArcLength, false);
            if (brickCount % 2 === 0) {
              brickCount++;
            }
          }
          break;
        case "count":
          if (!config.brickCount) {
            throw new Error("Missing brick count");
          }
          brickCount = config.brickCount;
          if (topRadius) {
            topFullArcLength = this.geometry.chordLengthToArcLength(fullLength, topRadius);
            topJointArcLength = this.geometry.chordLengthToArcLength(config.jointSize, topRadius);
          } else {
            topFullArcLength = topJointArcLength = null;
          }
          break;
        default:
          throw new Error(`Unrecognised brick division method: ${config.brickDivisionMethod}`);
      }
      if (config.topRise && config.topRise <= 0 || !topFullArcLength || !topJointArcLength || !topRadius) {
        let topJustBricks = fullLength - (brickCount - 1) * config.jointSize;
        topBrickWidth = topJustBricks / brickCount;
        topFullAngle = topBrickAngle = topJointAngle = null;
      } else {
        let justBricksArcLength = topFullArcLength - topJointArcLength * (brickCount - 1);
        let topBrickArcLength = justBricksArcLength / brickCount;
        topBrickAngle = this.geometry.arcLengthToArcAngle(topBrickArcLength, topRadius);
        topBrickWidth = this.geometry.arcLengthToTangentLength(this.geometry.arcAngleToArcLength(topBrickAngle, topRadius), topRadius);
        topJointAngle = this.geometry.arcLengthToArcAngle(topJointArcLength, topRadius);
        topFullAngle = this.geometry.arcLengthToArcAngle(config.opening + 2 * skewLength, topRadius);
      }
      let baseFullArcLength, baseJointArcLength, baseBrickAngle, baseBrickWidth, baseJointAngle;
      if (config.baseRise && config.baseRise <= 0 || baseRadius == null) {
        let baseJustBricks = config.opening - (brickCount - 1) * config.jointSize;
        baseBrickWidth = baseJustBricks / brickCount;
        baseBrickAngle = null;
        baseJointAngle = null;
      } else {
        baseFullArcLength = this.geometry.chordLengthToArcLength(config.opening, baseRadius);
        baseJointArcLength = this.geometry.chordLengthToArcLength(config.jointSize, baseRadius);
        let justBricksArcLength = baseFullArcLength - baseJointArcLength * (brickCount - 1);
        let baseBrickArcLength = justBricksArcLength / brickCount;
        baseBrickAngle = this.geometry.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
        baseBrickWidth = this.geometry.arcLengthToTangentLength(this.geometry.arcAngleToArcLength(baseBrickAngle, baseRadius), baseRadius);
        baseJointAngle = this.geometry.arcLengthToArcAngle(baseJointArcLength, baseRadius);
      }
      let drawingWidth = config.opening + 2 * skewLength;
      let drawingHeight = config.topRise ? config.height + config.topRise : config.height;
      const params = {
        type: config.type,
        drawingWidth,
        drawingHeight,
        opening: config.opening,
        height: config.height,
        jointSize: config.jointSize,
        skewAngle,
        skewLength,
        brickCount,
        baseBrickWidth,
        baseFullAngle,
        baseBrickAngle: baseBrickAngle ? baseBrickAngle : void 0,
        baseJointAngle: baseJointAngle ? baseJointAngle : void 0,
        topBrickWidth,
        topFullAngle,
        topBrickAngle: topBrickAngle ? topBrickAngle : void 0,
        topJointAngle: topJointAngle ? topJointAngle : void 0,
        baseRise: config.baseRise ? config.baseRise : 0,
        baseOrigin: baseOrigin ? baseOrigin : null,
        baseRadius: baseRadius ? baseRadius : null,
        // fullAngle: skewAngle * 2,
        topRise: config.topRise ? config.topRise : 0,
        topOrigin: topOrigin ? topOrigin : null,
        topRadius: topRadius ? topRadius : null,
        // Clear pieces
        pieces: []
      };
      return params;
    }
    calculatePieces(params) {
      if (!params.skewAngle || params.baseRise == void 0 || !params.topRise == void 0 || !params.jointSize || !params.skewLength || !params.baseBrickWidth || !params.topBrickWidth || !params.opening || !params.height) {
        throw new Error("Missing required parameters.");
      }
      for (let i = 0; i < params.brickCount; i++) {
        let piece = {};
        if (params.baseRise < 1) {
          piece["bl"] = [params.skewLength + (params.baseBrickWidth + params.jointSize) * i, 0];
          piece["br"] = [params.skewLength + (params.baseBrickWidth + params.jointSize) * i + params.baseBrickWidth, 0];
          piece["bc"] = [Math.abs(piece["bl"][0] - piece["bl"][1]), 0];
        } else {
          if (!params.baseOrigin || !params.baseRadius || !params.baseBrickAngle || !params.baseJointAngle || !params.baseFullAngle) {
            throw new Error("Missing required parameters for base rise.");
          }
          let baseStartAngle = Math.PI / 2 + params.baseFullAngle / 2 - params.baseBrickAngle / 2;
          let baseCurrentAngle = baseStartAngle - i * (params.baseBrickAngle + params.baseJointAngle);
          piece["bc"] = this.geometry.calculateEndpoint(params.baseOrigin[0], params.baseOrigin[1], params.baseRadius, baseCurrentAngle);
          piece["bl"] = this.geometry.calculateEndpoint(piece["bc"][0], piece["bc"][1], params.baseBrickWidth / 2, baseCurrentAngle + Math.PI / 2);
          piece["br"] = this.geometry.calculateEndpoint(piece["bc"][0], piece["bc"][1], params.baseBrickWidth / 2, baseCurrentAngle - Math.PI / 2);
        }
        if (params.topRise < 1) {
          piece["tl"] = [(params.topBrickWidth + params.jointSize) * i, params.height];
          piece["tr"] = [(params.topBrickWidth + params.jointSize) * i + params.topBrickWidth, params.height];
        } else {
          if (!params.topOrigin || !params.topRadius || !params.topBrickAngle || !params.topJointAngle || !params.topFullAngle) {
            throw new Error("Missing required parameters for top rise.");
          }
          let topStartAngle = Math.PI / 2 + params.topFullAngle / 2 - params.topBrickAngle / 2;
          let topCurrentAngle = topStartAngle - i * (params.topBrickAngle + params.topJointAngle);
          let tc = this.geometry.calculateEndpoint(params.topOrigin[0], params.topOrigin[1], params.topRadius, topCurrentAngle);
          piece["tc"] = tc;
          piece["tl"] = this.geometry.calculateEndpoint(tc[0], tc[1], params.topBrickWidth / 2, topCurrentAngle + Math.PI / 2);
          piece["tr"] = this.geometry.calculateEndpoint(tc[0], tc[1], params.topBrickWidth / 2, topCurrentAngle - Math.PI / 2);
        }
        params["pieces"].push(piece);
      }
    }
    // Conversion between angle and actual length of skew of flat arches using actual height of arch
    degToLength(deg, height) {
      return Math.tan(GeometryUtils.prototype.degToRad(deg)) * height;
    }
    radToLength(rad, height) {
      return Math.tan(rad) * height;
    }
    lengthToDeg(length, height) {
      return GeometryUtils.prototype.radToDeg(this.lengthToRad(length, height));
    }
    lengthToRad(length, height) {
      return Math.atan(length / height);
    }
  }
  class RadialArchCalculator extends ArchCalculator {
    constructor() {
      super();
    }
    calculateParameters(config) {
      let rise, baseRadius, topRadius, skewAngle, skewLength, origin, fullAngle, drawingWidth, drawingHeight;
      switch (config.type) {
        case "radial":
          switch (config.riseOrSkew) {
            case "rise":
              if (!config.rise) {
                throw new Error("Missing rise value");
              }
              rise = config.rise;
              if (rise > 0) {
                baseRadius = ((config.opening / 2) ** 2 / rise + rise) / 2;
                topRadius = baseRadius != null ? baseRadius + config.height : null;
                skewAngle = Math.atan(config.opening / 2 / (baseRadius - rise));
                skewLength = this.radToLength(skewAngle, config.height);
                origin = [config.opening / 2 + skewLength, rise - baseRadius];
                fullAngle = skewAngle * 2;
              } else {
                skewLength = skewAngle = fullAngle = 0;
                baseRadius = topRadius = origin = null;
              }
              break;
            case "deg":
              if (!config.skew) {
                throw new Error("Missing rise value");
              }
              skewAngle = this.geometry.degToRad(config.skew);
              if (skewAngle > 0) {
                fullAngle = skewAngle * 2;
                skewLength = this.radToLength(skewAngle, config.height);
                baseRadius = config.opening / 2 / Math.sin(skewAngle);
                topRadius = baseRadius != null ? baseRadius + config.height : null;
                rise = baseRadius - config.opening / 2 / Math.tan(skewAngle);
                origin = [config.opening / 2 + skewLength, rise - baseRadius];
              } else {
                skewLength = skewAngle = fullAngle = rise = 0;
                baseRadius = topRadius = origin = null;
              }
              break;
            case "mm":
              if (!config.skew) {
                throw new Error("Missing rise value");
              }
              skewLength = config.skew;
              if (skewLength > 0) {
                skewAngle = this.lengthToRad(skewLength, config.height);
                baseRadius = config.opening / 2 / Math.sin(skewAngle);
                topRadius = baseRadius != null ? baseRadius + config.height : null;
                rise = baseRadius - config.opening / 2 / Math.tan(skewAngle);
                fullAngle = skewAngle * 2;
                origin = [config.opening / 2 + skewLength, rise - baseRadius];
              } else {
                skewLength = skewAngle = fullAngle = rise = 0;
                baseRadius = topRadius = origin = null;
              }
              break;
            default:
              console.error(`Unrecognised rise/skew choice on radial arch: ${config.riseOrSkew}`);
              baseRadius = topRadius = origin = null;
              rise = skewAngle = skewLength = fullAngle = 0;
          }
          if (baseRadius && topRadius && origin) {
            drawingWidth = this.geometry.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2 - skewAngle)[0];
            drawingHeight = this.geometry.calculateEndpoint(origin[0], origin[1], topRadius, Math.PI / 2)[1];
          } else {
            drawingWidth = config.opening;
            drawingHeight = config.height;
          }
          break;
        case "semicircle":
          baseRadius = config.opening / 2;
          topRadius = baseRadius + config.height;
          skewAngle = this.geometry.degToRad(90);
          skewLength = config.height;
          rise = config.opening / 2;
          origin = [topRadius, 0];
          fullAngle = Math.PI;
          drawingWidth = 2 * topRadius;
          drawingHeight = topRadius;
          break;
        case "bullseye":
          baseRadius = config.opening / 2;
          topRadius = baseRadius + config.height;
          skewAngle = this.geometry.degToRad(180);
          skewLength = 0;
          rise = config.opening + config.height;
          origin = [topRadius, topRadius];
          fullAngle = 2 * Math.PI;
          drawingWidth = 2 * topRadius;
          drawingHeight = drawingWidth;
          break;
        default:
          throw new Error(`Unrecognised arch type: ${config.type}`);
      }
      if (fullAngle === null || baseRadius === null || topRadius === null || origin === null) {
        throw TypeError("Unexpected null value.");
      }
      let brickCount;
      let topArcLength = this.geometry.arcAngleToArcLength(fullAngle, topRadius);
      let topJointArcLength = this.geometry.tangentLengthToArcLength(config.jointSize, topRadius);
      switch (config.brickDivisionMethod) {
        case "width":
          if (!config.brickWidth) throw new Error("Missing brick width");
          config.brickWidth;
          let topBrickMaxArcLength = this.geometry.tangentLengthToArcLength(config.brickWidth, topRadius);
          brickCount = this.countBricks(topArcLength, topBrickMaxArcLength, topJointArcLength, config.type === "bullseye" ? true : false);
          if (config.type !== "bullseye" && brickCount % 2 === 0) {
            brickCount++;
          }
          break;
        case "count":
          if (!config.brickCount) throw new Error("Missing brick count");
          brickCount = config.brickCount;
          break;
        default:
          throw new Error(`Unrecognised brick division method: ${config.brickDivisionMethod}`);
      }
      let topJustBricksArc = topArcLength - (config.type === "bullseye" ? brickCount : brickCount - 1) * topJointArcLength;
      let topBrickArcLength = topJustBricksArc / brickCount;
      let topBrickWidth = this.geometry.arcLengthToTangentLength(topBrickArcLength, topRadius);
      let topBrickAngle = this.geometry.arcLengthToArcAngle(topBrickArcLength, topRadius);
      let topJointAngle = this.geometry.arcLengthToArcAngle(topJointArcLength, topRadius);
      let baseArcLength = this.geometry.arcAngleToArcLength(fullAngle, baseRadius);
      let baseJointArcLength = this.geometry.tangentLengthToArcLength(config.jointSize, baseRadius);
      let baseJointAngle = this.geometry.arcLengthToArcAngle(baseJointArcLength, baseRadius);
      let baseJustBricksArc = baseArcLength - (config.type === "bullseye" ? brickCount : brickCount - 1) * baseJointArcLength;
      let baseBrickArcLength = baseJustBricksArc / brickCount;
      let baseBrickAngle = this.geometry.arcLengthToArcAngle(baseBrickArcLength, baseRadius);
      let baseBrickWidth = this.geometry.arcLengthToTangentLength(baseBrickArcLength, baseRadius);
      const params = {
        type: config.type,
        drawingWidth,
        drawingHeight,
        // Store measurements in object
        opening: config.opening,
        height: config.height,
        jointSize: config.jointSize,
        skewAngle,
        skewLength,
        brickCount,
        baseBrickWidth,
        baseBrickAngle: baseBrickAngle ? baseBrickAngle : void 0,
        baseJointAngle: baseJointAngle ? baseJointAngle : void 0,
        topBrickWidth,
        topBrickAngle: topBrickAngle ? topBrickAngle : void 0,
        topJointAngle: topJointAngle ? topJointAngle : void 0,
        riseOrSkew: config.riseOrSkew,
        rise,
        origin: origin ? origin : null,
        baseRadius: baseRadius ? baseRadius : null,
        topRadius: topRadius ? topRadius : null,
        fullAngle: skewAngle * 2,
        // Clear pieces
        pieces: []
      };
      return params;
    }
    calculatePieces(params) {
      if (!params.skewAngle || !params.baseBrickAngle || !params.topBrickAngle || !params.origin || !params.baseRadius || !params.topRadius || params.type !== "bullseye" && !params.skewLength || !params.baseBrickWidth || !params.topBrickWidth || !params.brickCount || !params.height || !params.opening || !params.baseJointAngle || !params.topJointAngle) {
        throw new Error("Missing required parameters");
      }
      let baseCurrentAngle = Math.PI / 2 + params.skewAngle - params.baseBrickAngle / 2;
      let topCurrentAngle = Math.PI / 2 + params.skewAngle - params.topBrickAngle / 2;
      if (params.type === "bullseye") {
        baseCurrentAngle -= Math.PI - params.baseBrickAngle / 2;
        topCurrentAngle -= Math.PI - params.topBrickAngle / 2;
      }
      for (let i = 0; i < params.brickCount; i++) {
        let piece = {};
        piece["bc"] = this.geometry.calculateEndpoint(params.origin[0], params.origin[1], params.baseRadius, baseCurrentAngle);
        piece["tc"] = this.geometry.calculateEndpoint(params.origin[0], params.origin[1], params.topRadius, topCurrentAngle);
        if (params.type !== "semicircle" || i > 0) {
          piece["bl"] = this.geometry.calculateEndpoint(piece["bc"][0], piece["bc"][1], params.baseBrickWidth / 2, baseCurrentAngle + Math.PI / 2);
          piece["tl"] = this.geometry.calculateEndpoint(piece["tc"][0], piece["tc"][1], params.topBrickWidth / 2, topCurrentAngle + Math.PI / 2);
        } else {
          piece["bl"] = [params.height, 0];
          piece["tl"] = [0, 0];
        }
        if (params.type !== "semicircle" || i < params.brickCount - 1) {
          piece["br"] = this.geometry.calculateEndpoint(piece["bc"][0], piece["bc"][1], params.baseBrickWidth / 2, baseCurrentAngle - Math.PI / 2);
          piece["tr"] = this.geometry.calculateEndpoint(piece["tc"][0], piece["tc"][1], params.topBrickWidth / 2, topCurrentAngle - Math.PI / 2);
        } else {
          piece["br"] = [params.height + params.opening, 0];
          piece["tr"] = [2 * params.height + params.opening, 0];
        }
        params["pieces"].push(piece);
        baseCurrentAngle -= params.baseBrickAngle + params.baseJointAngle;
        topCurrentAngle -= params.topBrickAngle + params.topJointAngle;
      }
    }
    // Conversion between angle and actual length of skew of radial arches using angular height of arch
    degToLength(deg, height) {
      return Math.sin(GeometryUtils.prototype.degToRad(deg)) * height;
    }
    radToLength(rad, height) {
      return Math.sin(rad) * height;
    }
    lengthToDeg(length, height) {
      return GeometryUtils.prototype.radToDeg(this.lengthToRad(length, height));
    }
    lengthToRad(length, height) {
      return Math.asin(length / height);
    }
  }
  class ToolbarManager {
    constructor(toolbarElement, fields) {
      this.toolbarElement = toolbarElement;
      this.fields = fields;
    }
    populateToolbar() {
      for (let field of this.fields) {
        const fieldElement = document.createElement("span");
        const labelElement = document.createElement("label");
        let inputElement;
        fieldElement.setAttribute("id", `${field.name}-toolbar-item`);
        fieldElement.classList.add("arch-toolbar-item");
        for (let type in field.visibleFor) {
          fieldElement.classList.add(`${type}-toolbar-item`);
        }
        labelElement.setAttribute("for", field.name);
        labelElement.innerText = field.label;
        switch (field.type) {
          case "number":
            inputElement = document.createElement("input");
            inputElement.setAttribute("type", "number");
            inputElement.setAttribute("id", field.id);
            inputElement.setAttribute("name", field.name);
            inputElement.setAttribute("value", field.defaultValue ? field.defaultValue.toString() : "0");
            if (field.hasOwnProperty("min") && field.min != void 0)
              inputElement.setAttribute("min", field.min.toString());
            if (field.hasOwnProperty("max") && field.max != void 0)
              inputElement.setAttribute("max", field.max.toString());
            if (field.hasOwnProperty("step") && field.step != void 0)
              inputElement.setAttribute("step", field.step.toString());
            fieldElement.appendChild(labelElement);
            fieldElement.appendChild(inputElement);
            break;
          case "select":
            inputElement = document.createElement("select");
            inputElement.setAttribute("id", field.id);
            inputElement.setAttribute("name", field.name);
            if (field.hasOwnProperty("defaultValue") && field.defaultValue)
              inputElement.setAttribute("value", field.defaultValue.toString());
            if (field.hasOwnProperty("options") && field.options) {
              for (let option of field.options) {
                const optionElement = document.createElement("option");
                optionElement.setAttribute("value", option.value);
                optionElement.innerText = option.label;
                inputElement.appendChild(optionElement);
              }
            }
            fieldElement.appendChild(labelElement);
            fieldElement.appendChild(inputElement);
            break;
          case "checkbox":
            inputElement = document.createElement("input");
            inputElement.setAttribute("type", "checkbox");
            inputElement.setAttribute("id", field.id);
            inputElement.setAttribute("name", field.name);
            if (field.hasOwnProperty("defaultValue") && field.defaultValue)
              inputElement.setAttribute("checked", "true");
            fieldElement.appendChild(inputElement);
            fieldElement.appendChild(labelElement);
            break;
          default:
            throw new Error(`Unrecognised field type: ${field.type}`);
        }
        if (field.hasOwnProperty("additional") && field.additional) {
          for (let additionalField of field.additional) {
            const additionalLabelElement = document.createElement("label");
            let additionalElement;
            additionalLabelElement.setAttribute("for", additionalField.id);
            additionalLabelElement.innerText = additionalField.label;
            switch (additionalField.type) {
              case "number":
                additionalElement = document.createElement("input");
                additionalElement.setAttribute("type", "number");
                additionalElement.setAttribute("id", additionalField.id);
                additionalElement.setAttribute("name", additionalField.name);
                additionalElement.setAttribute("value", additionalField.defaultValue ? additionalField.defaultValue.toString() : "0");
                if (additionalField.hasOwnProperty("min") && additionalField.min != void 0)
                  additionalElement.setAttribute("min", additionalField.min.toString());
                if (additionalField.hasOwnProperty("max") && additionalField.max != void 0)
                  additionalElement.setAttribute("max", additionalField.max.toString());
                if (additionalField.hasOwnProperty("step") && additionalField.step != void 0)
                  additionalElement.setAttribute("step", additionalField.step.toString());
                fieldElement.appendChild(additionalLabelElement);
                fieldElement.appendChild(additionalElement);
                break;
              case "select":
                additionalElement = document.createElement("select");
                additionalElement.setAttribute("id", additionalField.id);
                additionalElement.setAttribute("name", additionalField.name);
                if (additionalField.hasOwnProperty("defaultValue") && additionalField.defaultValue)
                  additionalElement.setAttribute("value", additionalField.defaultValue.toString());
                if (additionalField.hasOwnProperty("options") && additionalField.options) {
                  for (let option of additionalField.options) {
                    const optionElement = document.createElement("option");
                    optionElement.setAttribute("value", option.value);
                    optionElement.innerText = option.label;
                    additionalElement.appendChild(optionElement);
                  }
                }
                fieldElement.appendChild(additionalLabelElement);
                fieldElement.appendChild(additionalElement);
                break;
              case "checkbox":
                additionalElement = document.createElement("input");
                additionalElement.setAttribute("type", "checkbox");
                additionalElement.setAttribute("id", additionalField.id);
                additionalElement.setAttribute("name", additionalField.name);
                if (additionalField.hasOwnProperty("defaultValue") && additionalField.defaultValue)
                  additionalElement.setAttribute("checked", "true");
                fieldElement.appendChild(additionalElement);
                fieldElement.appendChild(additionalLabelElement);
                break;
            }
          }
        }
        this.toolbarElement.appendChild(fieldElement);
      }
    }
    showFieldsForArchType(archType) {
      for (let field of this.fields) {
        const fieldElement = this.toolbarElement.querySelector(`#${field.name}-toolbar-item`);
        if (!fieldElement || !(fieldElement instanceof HTMLSpanElement)) {
          console.error(`Field #${field.name}-toolbar-item is not an input element.`);
          continue;
        }
        if (field.visibleFor && field.visibleFor.includes(archType)) {
          fieldElement.style.display = "inline-block";
        } else {
          fieldElement.style.display = "none";
        }
      }
    }
    getFormData() {
      const elements = this.toolbarElement.elements;
      const formData = {};
      for (let field of this.fields) {
        if (!elements.hasOwnProperty(field.name)) {
          continue;
        }
        const fieldElement = elements.namedItem(field.name);
        if (!fieldElement) {
          continue;
        } else if (fieldElement instanceof HTMLInputElement) {
          if (fieldElement.type === "radio") {
            formData[field.name] = fieldElement.checked;
            continue;
          }
        }
        switch (field.type) {
          case "number":
            if (!(fieldElement instanceof HTMLInputElement)) {
              throw new Error(`Field ${field.name} is not an input element.`);
            }
            formData[field.name] = fieldElement.value;
            break;
          case "select":
            if (!(fieldElement instanceof HTMLSelectElement)) {
              throw new Error(`Field ${field.name} is not a select element.`);
            }
            formData[field.name] = fieldElement.value;
            break;
          case "checkbox":
            if (!(fieldElement instanceof HTMLInputElement) || fieldElement.type !== "checkbox") {
              throw new Error(`Field ${field.name} is not a checkbox element.`);
            }
            formData[field.name] = fieldElement.checked;
            break;
          default:
            throw new Error(`Unrecognised field type: ${field.type}`);
        }
        if (field.hasOwnProperty("additional") && field.additional) {
          for (let additionalField of field.additional) {
            const additionalFieldElement = elements.namedItem(additionalField.name);
            if (!additionalFieldElement) {
              continue;
            } else if (additionalFieldElement instanceof HTMLInputElement) {
              if (additionalFieldElement.type === "radio") {
                formData[additionalField.name] = additionalFieldElement.checked;
                continue;
              }
            }
            switch (additionalField.type) {
              case "number":
                if (!(additionalFieldElement instanceof HTMLInputElement)) {
                  throw new Error(`Field ${additionalField.name} is not an input element.`);
                }
                formData[additionalField.name] = additionalFieldElement.value;
                break;
              case "select":
                if (!(additionalFieldElement instanceof HTMLSelectElement)) {
                  throw new Error(`Field ${additionalField.name} is not a select element.`);
                }
                formData[additionalField.name] = additionalFieldElement.value;
                break;
              case "checkbox":
                if (!(additionalFieldElement instanceof HTMLInputElement) || additionalFieldElement.type !== "checkbox") {
                  throw new Error(`Field ${additionalField.name} is not a checkbox element.`);
                }
                formData[additionalField.name] = additionalFieldElement.checked;
                break;
              default:
                throw new Error(`Unrecognised field type: ${additionalField.type}`);
            }
          }
        }
      }
      return formData;
    }
    readConfig(formData) {
      let brickWidth, brickCount;
      switch (formData["type"]) {
        case "flat":
          brickWidth = brickCount = void 0;
          switch (formData["brick-division-select"]) {
            case "width":
              brickWidth = parseInt(formData["brick-width-or-count"]);
              break;
            case "count":
              brickCount = formData["brick-width-or-count"];
              break;
            default:
              throw new Error(`Unrecognised brick division method: ${formData.brickDivisionMethod}`);
          }
          const config = {
            type: "flat",
            opening: parseInt(formData["opening"]),
            height: parseInt(formData["height"]),
            jointSize: parseInt(formData["joint-size"]),
            brickDivisionMethod: formData["brick-division-select"],
            brickWidth,
            brickCount,
            baseRise: parseInt(formData["base-rise"]),
            topRise: parseInt(formData["top-rise"]),
            skewUnit: formData["skew-units-select"],
            skew: parseInt(formData["skew"])
          };
          return config;
        case "radial":
        case "semicircle":
        case "bullseye":
          let rise, skew;
          brickWidth = brickCount = void 0;
          switch (formData["rise-or-skew-select"]) {
            case "rise":
              rise = parseInt(formData["rise-or-skew"]);
              break;
            case "deg":
            case "mm":
              skew = parseInt(formData["rise-or-skew"]);
              break;
            default:
              throw new Error(`Unrecognised rise/skew choice on radial arch: ${formData["rise-or-skew"]}`);
          }
          switch (formData["brick-division-select"]) {
            case "width":
              brickWidth = parseInt(formData["brick-width-or-count"]);
              break;
            case "count":
              brickCount = parseInt(formData["brick-width-or-count"]);
              break;
            default:
              throw new Error(`Unrecognised brick division method: ${formData["brick-division-select"]}`);
          }
          return {
            type: formData.type,
            opening: parseInt(formData["opening"]),
            height: parseInt(formData["height"]),
            jointSize: parseInt(formData["joint-size"]),
            brickDivisionMethod: formData["brick-division-select"],
            brickWidth,
            brickCount,
            riseOrSkew: formData["rise-or-skew-select"],
            rise,
            skew
          };
        default:
          throw new Error(`Unrecognised arch type: ${formData.type}`);
      }
    }
    updateFieldVisibility(archType) {
      const archTypeField = this.fields.find((field) => field.name === "arch-type-toolbar-select");
      if (archTypeField) {
        archTypeField.visibleFor = archType === "flat" ? ["flat", "radial", "semicircle", "bullseye"] : ["flat", "radial"];
      }
    }
  }
  class ArchRenderer {
    constructor(canvas) {
      this.geometry = new GeometryUtils();
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.geometry = new GeometryUtils();
    }
    render(layout) {
      this.drawPieces(layout.pieces);
    }
    drawPieces(pieces) {
      for (let piece of pieces) {
        this.ctx.beginPath();
        this.ctx.lineTo(piece.bl[0], piece.bl[1]);
        this.ctx.lineTo(piece.br[0], piece.br[1]);
        this.ctx.lineTo(piece.tr[0], piece.tr[1]);
        this.ctx.lineTo(piece.tl[0], piece.tl[1]);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }
    adjustCanvas(width, height, clear) {
      globalThis.Arch.app.margin = Math.max(Math.round(height / 300), Math.round(width / 500)) * 50;
      this.canvas.width = width + 2 * globalThis.Arch.app.margin;
      this.canvas.height = height + 2 * globalThis.Arch.app.margin;
      this.ctx.resetTransform();
      if (clear) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.ctx.translate(globalThis.Arch.app.margin, globalThis.Arch.app.margin);
      this.ctx.lineWidth = Math.min(width / 500, Math.ceil(globalThis.Arch.app.config.jointSize / 2));
    }
  }
  class FlatArchRenderer extends ArchRenderer {
    constructor(canvas) {
      super(canvas);
    }
    drawOutline(parameters, clear) {
      if (parameters.baseRise == null || parameters.topRise == null || parameters.skewAngle == null || parameters.skewLength == null || parameters.height == null) {
        throw new Error("Missing required parameters.");
      }
      this.adjustCanvas(parameters.drawingWidth, parameters.drawingHeight, clear);
      let bl, br, tr, tl;
      bl = [parameters.skewLength, 0];
      br = [parameters.skewLength + Number(parameters.opening), 0];
      tr = [parameters.skewLength * 2 + Number(parameters.opening), parameters.height];
      tl = [0, parameters.height];
      this.ctx.beginPath();
      this.ctx.lineTo(bl[0], bl[1]);
      if (parameters.baseRise < 1) {
        this.ctx.lineTo(br[0], br[1]);
      } else {
        if (parameters.baseOrigin == null || parameters.baseRadius == null || parameters.baseFullAngle == null) {
          throw new Error("Missing required parameters.");
        }
        this.ctx.arc(parameters.baseOrigin[0], parameters.baseOrigin[1], parameters.baseRadius, Math.PI / 2 + parameters.baseFullAngle / 2, Math.PI / 2 - parameters.baseFullAngle / 2, true);
      }
      this.ctx.lineTo(tr[0], tr[1]);
      if (parameters.topRise < 1) {
        this.ctx.lineTo(tl[0], tl[1]);
      } else {
        if (parameters.topOrigin == null || parameters.topRadius == null || parameters.topFullAngle == null) {
          throw new Error("Missing required parameters.");
        }
        this.ctx.arc(parameters.topOrigin[0], parameters.topOrigin[1], parameters.topRadius, Math.PI / 2 - parameters.topFullAngle / 2, Math.PI / 2 + parameters.topFullAngle / 2);
      }
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
  class RadialArchRenderer extends ArchRenderer {
    constructor(canvas) {
      super(canvas);
    }
    drawOutline(parameters, clear) {
      console.log("drawOutline");
      if (parameters.baseBrickAngle == null || parameters.topBrickAngle == null || parameters.baseJointAngle == null || parameters.topJointAngle == null || parameters.origin == null || parameters.baseRadius == null || parameters.topRadius == null || parameters.skewAngle == null || parameters.skewLength == null || parameters.height == null || parameters.brickCount == null || parameters.baseBrickWidth == null || parameters.topBrickWidth == null || parameters.fullAngle == null) {
        throw new Error("Missing required parameters.");
      }
      this.adjustCanvas(parameters.drawingWidth, parameters.drawingHeight, clear);
      let bl, tr;
      bl = this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.baseRadius, Math.PI / 2 - parameters.skewAngle);
      this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.baseRadius, Math.PI / 2 + parameters.skewAngle);
      tr = this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.topRadius, Math.PI / 2 + parameters.skewAngle);
      this.geometry.calculateEndpoint(parameters.origin[0], parameters.origin[1], parameters.topRadius, Math.PI / 2 - parameters.skewAngle);
      let startAngle = Math.PI / 2 - parameters.skewAngle, endAngle = Math.PI / 2 + parameters.skewAngle;
      this.ctx.beginPath();
      this.ctx.lineTo(bl[0], bl[1]);
      this.ctx.arc(parameters.origin[0], parameters.origin[1], parameters.baseRadius, startAngle, endAngle, false);
      this.ctx.lineTo(tr[0], tr[1]);
      this.ctx.arc(parameters.origin[0], parameters.origin[1], parameters.topRadius, endAngle, startAngle, true);
      this.ctx.lineTo(bl[0], bl[1]);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
  class AxisRenderer {
    constructor(canvasContainer) {
      this.canvasContainer = canvasContainer;
      this.canvas = this.canvasContainer.querySelector("canvas#arch-drawing-area");
      if (!(this.canvas instanceof HTMLCanvasElement)) {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "arch-drawing-area");
        this.canvasContainer.appendChild(this.canvas);
      }
      this.axes = this.canvasContainer.querySelector("div#arch-axes");
      if (!(this.axes instanceof HTMLDivElement)) {
        this.axes = document.createElement("div");
        this.axes.setAttribute("id", "arch-axes");
        this.canvasContainer.appendChild(this.axes);
      }
      this.grid = this.canvasContainer.querySelector("div#arch-grid");
      if (!(this.grid instanceof HTMLDivElement)) {
        this.grid = document.createElement("div");
        this.grid.setAttribute("id", "arch-grid");
        this.canvasContainer.appendChild(this.grid);
      }
      this.toggleBox = this.canvasContainer.querySelector("form#axes-toggle-box");
      if (!(this.toggleBox instanceof HTMLDivElement)) {
        this.toggleBox = document.createElement("form");
        this.toggleBox.setAttribute("id", "axes-toggle-box");
        const axesVisibilityLabel = document.createElement("label");
        axesVisibilityLabel.setAttribute("for", "axes-visibility-chk");
        axesVisibilityLabel.innerText = "Axes";
        this.toggleBox.appendChild(axesVisibilityLabel);
        const axesVisibilityInput = document.createElement("input");
        axesVisibilityInput.setAttribute("type", "checkbox");
        axesVisibilityInput.setAttribute("id", "axes-visibility-chk");
        axesVisibilityInput.setAttribute("name", "axes");
        axesVisibilityInput.setAttribute("checked", "true");
        axesVisibilityInput.addEventListener("change", () => {
          this.showAxes(axesVisibilityInput.checked);
        });
        this.toggleBox.appendChild(axesVisibilityInput);
        const gridVisibilityLabel = document.createElement("label");
        gridVisibilityLabel.setAttribute("for", "grid-visibility-chk");
        gridVisibilityLabel.innerText = "Grid";
        this.toggleBox.appendChild(gridVisibilityLabel);
        const gridVisibilityInput = document.createElement("input");
        gridVisibilityInput.setAttribute("type", "checkbox");
        gridVisibilityInput.setAttribute("id", "grid-visibility-chk");
        gridVisibilityInput.setAttribute("name", "grid");
        gridVisibilityInput.setAttribute("checked", "true");
        gridVisibilityInput.addEventListener("change", () => {
          this.showGrid(gridVisibilityInput.checked);
        });
        this.toggleBox.appendChild(gridVisibilityInput);
        this.canvasContainer.appendChild(this.toggleBox);
      }
    }
    updateAxes(canvasWidth, canvasHeight, margin) {
      let precision = Math.max(
        this.nearestPrecision(canvasWidth, 10),
        this.nearestPrecision(canvasHeight, 8)
      );
      var axesLabelSize = Math.max(Math.round(canvasHeight / 40), Math.round(canvasWidth / 50));
      const axesWidth = Math.floor(canvasWidth / 300);
      const gridWidth = Math.floor(canvasWidth / 400);
      this.axes.innerHTML = "";
      this.grid.innerHTML = "";
      const xAxis = document.createElement("div");
      xAxis.className = "axis x";
      xAxis.style.top = `${this.canvas.height - margin + 1}px`;
      xAxis.style.width = `${this.canvas.width}px`;
      xAxis.style.height = `${axesWidth}px`;
      this.axes.appendChild(xAxis);
      const yAxis = document.createElement("div");
      yAxis.className = "axis y";
      yAxis.style.left = `${margin - axesWidth}px`;
      yAxis.style.height = `${this.canvas.height}px`;
      yAxis.style.width = `${axesWidth}px`;
      this.axes.appendChild(yAxis);
      for (let i = 0; i <= this.canvas.width; i += precision) {
        const label = document.createElement("div");
        label.className = "axis-label x";
        label.style.left = `${margin + i - 1}px`;
        label.style.top = `${this.canvas.height - margin + axesLabelSize}px`;
        label.style.fontSize = `${axesLabelSize}px`;
        label.innerHTML = i.toString();
        this.axes.appendChild(label);
        const grid = document.createElement("div");
        grid.className = "grid y";
        grid.style.left = `${i + margin - 1}px`;
        grid.style.height = `${this.canvas.height}px`;
        grid.style.width = `${gridWidth}px`;
        this.grid.appendChild(grid);
      }
      for (let i = 0; i <= this.canvas.height; i += precision) {
        const label = document.createElement("div");
        label.className = "axis-label y";
        label.style.top = `${this.canvas.height - margin - i}px`;
        label.style.right = `${this.canvas.width - margin + axesLabelSize}px `;
        label.style.fontSize = `${axesLabelSize}px`;
        label.innerHTML = i.toString();
        this.axes.appendChild(label);
        const grid = document.createElement("div");
        grid.className = "grid x";
        grid.style.top = `${this.canvas.height - i - margin}px`;
        grid.style.width = `${this.canvas.width}px`;
        grid.style.height = `${gridWidth}px`;
        this.grid.appendChild(grid);
      }
    }
    generatePrecision(n) {
      const nums = [10, 12.5, 25, 50];
      return nums[n % 4] * Math.pow(10, Math.floor(n / 4));
    }
    nearestPrecision(distance, freq) {
      let estimatedPrecision = Math.round(distance / freq);
      let n = 0;
      let currentPrecision = this.generatePrecision(n);
      let closestPrecision = currentPrecision;
      while (currentPrecision <= estimatedPrecision) {
        closestPrecision = currentPrecision;
        n++;
        currentPrecision = this.generatePrecision(n);
      }
      let nextPrecision = this.generatePrecision(n);
      if (Math.abs(nextPrecision - estimatedPrecision) < Math.abs(closestPrecision - estimatedPrecision)) {
        closestPrecision = nextPrecision;
      } else {
        n--;
      }
      return closestPrecision;
    }
    showAxes(show) {
      this.axes.style.visibility = show ? "visible" : "hidden";
    }
    showGrid(show) {
      this.grid.style.visibility = show ? "visible" : "hidden";
    }
  }
  class ArchCalculatorFactory {
    static create(type) {
      switch (type) {
        case "flat":
          return new FlatArchCalculator();
        case "radial":
        case "semicircle":
        case "bullseye":
          return new RadialArchCalculator();
        default:
          throw new Error(`Unrecognised arch type: ${type}`);
      }
    }
  }
  class ArchApplication {
    constructor(container) {
      this.container = container;
      let contentElement = container.querySelector("div.project-content");
      let toolbarElement = container.querySelector("form#arch-parameters-form");
      let canvasContainer = container.querySelector("div.canvas-container");
      let canvas = container.querySelector("canvas#arch-drawing-area");
      if (!contentElement || !(contentElement instanceof HTMLDivElement)) {
        contentElement = document.createElement("div");
        contentElement.setAttribute("class", "project-content");
        this.container.appendChild(contentElement);
      }
      if (!toolbarElement || !(toolbarElement instanceof HTMLFormElement)) {
        toolbarElement = document.createElement("form");
        toolbarElement.setAttribute("id", "arch-parameters-form");
        contentElement.appendChild(toolbarElement);
      }
      if (!canvasContainer || !(canvasContainer instanceof HTMLDivElement)) {
        canvasContainer = document.createElement("div");
        canvasContainer.setAttribute("class", "canvas-container");
        contentElement.appendChild(canvasContainer);
      }
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        canvas = document.createElement("canvas");
        canvas.setAttribute("id", "arch-drawing-area");
        canvasContainer.appendChild(canvas);
      }
      this.canvas = canvas;
      if (container.querySelector("div.canvas-container") && container.querySelector("div.canvas-container") instanceof HTMLDivElement) {
        this.canvasContainer = container.querySelector("div.canvas-container");
      } else {
        this.canvasContainer = document.createElement("div");
        this.canvasContainer.setAttribute("class", "canvas-container");
        contentElement.appendChild(this.canvasContainer);
      }
      this.config = DEFAULT_ARCH_CONFIG;
      this.calculator = ArchCalculatorFactory.create(this.config.type);
      switch (this.config.type) {
        case "flat":
          this.renderer = new FlatArchRenderer(this.canvas);
          break;
        case "radial":
          this.renderer = new RadialArchRenderer(this.canvas);
          break;
        default:
          throw new Error(`Unrecognised arch type: ${this.config.type}`);
      }
      this.axisRenderer = new AxisRenderer(this.canvasContainer);
      this.toolbar = new ToolbarManager(toolbarElement, TOOLBAR_FIELDS);
      this.toolbar.populateToolbar();
      this.setArchType(this.config.type);
      this.setupEventListeners();
      this.resizeObserver = new ResizeObserver(() => {
        this.refresh();
      });
      this.resizeObserver.observe(this.container);
      this.margin = DEFAULT_CANVAS_MARGIN;
    }
    setArchType(type) {
      this.toolbar.showFieldsForArchType(type);
    }
    updateConfiguration(config) {
      this.config = Object.assign(this.config, config);
    }
    refresh() {
      console.log("Refreshing...");
      this.config = this.toolbar.readConfig(this.toolbar.getFormData());
      switch (this.config.type) {
        case "flat":
          this.renderer = new FlatArchRenderer(this.canvas);
          this.calculator = new FlatArchCalculator();
          break;
        case "radial":
        case "semicircle":
        case "bullseye":
          this.renderer = new RadialArchRenderer(this.canvas);
          this.calculator = new RadialArchCalculator();
          break;
        default:
          throw new Error(`Unrecognised arch type: ${this.config.type}`);
      }
      this.calculateAndRender();
    }
    calculateAndRender() {
      if (this.config.type === "flat" && this.calculator instanceof FlatArchCalculator && this.renderer instanceof FlatArchRenderer) {
        const parameters = this.calculator.calculateParameters(this.config);
        this.calculator.calculatePieces(parameters);
        this.renderer.adjustCanvas(parameters.drawingWidth, parameters.drawingHeight, true);
        this.renderer.drawPieces(parameters.pieces);
      } else if ((this.config.type === "radial" || this.config.type === "semicircle" || this.config.type === "bullseye") && this.calculator instanceof RadialArchCalculator && this.renderer instanceof RadialArchRenderer) {
        const parameters = this.calculator.calculateParameters(this.config);
        this.calculator.calculatePieces(parameters);
        this.renderer.adjustCanvas(parameters.drawingWidth, parameters.drawingHeight, true);
        this.renderer.drawPieces(parameters.pieces);
      } else {
        throw new Error(`Unrecognised arch type: ${this.config.type}`);
      }
      this.axisRenderer.updateAxes(this.canvas.width, this.canvas.height, this.margin);
      this.adjustViewport();
    }
    setupEventListeners() {
      const minimiseButton = this.container.querySelector(".project-window-minimise");
      const titlebar = this.container.querySelector(".project-title-bar");
      const typeSelectElement = this.toolbar.toolbarElement.querySelector("select#arch-type-toolbar-select");
      const brickDivisionLabelElement = this.toolbar.toolbarElement.querySelector("span#brick-width-or-count-toolbar-item > label");
      const brickDivisionSelectElement = this.toolbar.toolbarElement.querySelector("select#brick-division-toolbar-select");
      const riseOrSkewLabelElement = this.toolbar.toolbarElement.querySelector("span#rise-or-skew-toolbar-item > label");
      const riseOrSkewSelectElement = this.toolbar.toolbarElement.querySelector("select#rise-or-skew-toolbar-select");
      if (minimiseButton && titlebar) {
        minimiseButton.addEventListener("change", () => {
          if (minimiseButton.checked) {
            this.container.style.height = `${titlebar.getBoundingClientRect().height}px`;
          }
        });
      }
      if (typeSelectElement instanceof HTMLSelectElement) {
        typeSelectElement.addEventListener("change", () => {
          this.setArchType(typeSelectElement.value);
        });
      }
      if (brickDivisionLabelElement && brickDivisionSelectElement) {
        brickDivisionSelectElement.addEventListener("change", () => {
          switch (brickDivisionSelectElement.value) {
            case "width":
              brickDivisionLabelElement.innerText = "Brick width:";
              break;
            case "count":
              brickDivisionLabelElement.innerText = "No. of bricks:";
              break;
            default:
              throw new Error(`Unrecognised brick division method: ${brickDivisionSelectElement.value}`);
          }
        });
      }
      if (riseOrSkewLabelElement && riseOrSkewSelectElement) {
        riseOrSkewSelectElement.addEventListener("change", () => {
          switch (riseOrSkewSelectElement.value) {
            case "rise":
              riseOrSkewLabelElement.innerText = "Rise:";
              break;
            case "deg":
            case "mm":
              riseOrSkewLabelElement.innerText = "Skew:";
              break;
            default:
              throw new Error(`Unrecognised rise/skew choice: ${riseOrSkewSelectElement.value}`);
          }
        });
      }
      for (let field of this.toolbar.fields) {
        const fieldElement = this.toolbar.toolbarElement.querySelector(`[name=${field.name}]`);
        if (!fieldElement || !(fieldElement instanceof HTMLInputElement) && !(fieldElement instanceof HTMLSelectElement)) {
          console.error(`Field #${field.name}-toolbar-item is not an input element.`);
          continue;
        }
        fieldElement.addEventListener("change", () => {
          this.refresh();
        });
        if (field.hasOwnProperty("additional") && field.additional) {
          for (let additionalField of field.additional) {
            const additionalFieldElement = this.toolbar.toolbarElement.querySelector(`[name=${additionalField.name}]`);
            if (!additionalFieldElement || !(additionalFieldElement instanceof HTMLInputElement) && !(additionalFieldElement instanceof HTMLSelectElement) && !(additionalFieldElement instanceof HTMLTextAreaElement) && !(additionalFieldElement instanceof HTMLButtonElement)) {
              continue;
            }
            additionalFieldElement.addEventListener("change", () => {
              this.refresh();
            });
          }
        }
      }
    }
    adjustContainerHeight(normal) {
      if (normal) {
        this.container.style.height = `${globalThis.Arch.titlebar.getBoundingClientRect().height + this.toolbar.toolbarElement.getBoundingClientRect().height + this.canvasContainer.getBoundingClientRect().height}px`;
      } else {
        this.container.style.height = "";
      }
    }
    adjustViewport() {
      console.log("adjustViewport");
      const windowHeight = document.body.getBoundingClientRect().height;
      const titleBarHeight = globalThis.Arch.titlebar.getBoundingClientRect().height;
      const toolbarHeight = globalThis.Arch.app.toolbar.toolbarElement.getBoundingClientRect().height;
      const axesToggleBox = this.container.querySelector("#axes-toggle-box");
      let maxHeight;
      if (this.container.classList.contains("maximised")) {
        maxHeight = windowHeight - titleBarHeight - toolbarHeight;
      } else {
        maxHeight = windowHeight * 0.6 - titleBarHeight - toolbarHeight;
      }
      var scale = Math.min(
        globalThis.Arch.content.getBoundingClientRect().width / this.canvas.width,
        maxHeight / this.canvas.height
      );
      this.canvasContainer.style.width = `${this.canvas.width}px`;
      this.canvasContainer.style.height = `${this.canvas.height}px`;
      this.canvasContainer.style.transform = `scale(${scale})`;
      this.canvasContainer.style.transformOrigin = "top left";
      if (!axesToggleBox) {
        return;
      }
      axesToggleBox.style.transform = `scale(${1 / scale})`;
      if (this.container.classList.contains("maximised") || this.container.classList.contains("minimised")) {
        this.adjustContainerHeight(false);
      } else {
        this.adjustContainerHeight(true);
      }
    }
  }
  class Arch extends Project {
    constructor(container) {
      super("brick-arch", "Brick Arch", container);
      this.app = new ArchApplication(container);
    }
  }
})();
