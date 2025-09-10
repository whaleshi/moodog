/**
 * 廖力编写
 * 模块名称：首页的第一屏
 * 模块说明：首页的第一屏
 * 编写时间：2023年7月12日 09:43:02
 */
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  FC,
  ReactElement
} from "react";
import useJquery, {
  jQueryObject,
  isRunningInServer
} from "@bobliao/use-jquery-hook";
import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "react-pixi-fiber";
import ResizeObserver from "resize-observer-polyfill";
import "./index.css";

let dog = require("./images/dog.png");
let dotsMartix = require("./images/dotsMartix.png");
let light = require("./images/light.png");
let logo = require("./images/logo.png");
let logo_shadow = require("./images/logo_shadow.png");
let ring1 = require("./images/ring1_s.png");
let ring2 = require("./images/ring2_s.png");
let ring3 = require("./images/ring3_s.png");
let dotsMartix_item = require("./images/dotsMartix_item.png");
let tr_1 = require("./images/tr_1.png");
let tr_2 = require("./images/tr_2.png");
let c_1 = require("./images/c_1.png");
let c_2 = require("./images/c_2.png");
let c_r = require("./images/c_r.png");
let dotsMartix_item_g = require("./images/dotsMartix_item_g.png");
let dotsMartix_item_w = require("./images/dotsMartix_item_w.png");
let mask = require("./images/mask.png");
let bw = require("./images/wallPaper.jpg");

export interface textureArrCatch {
  [propName: string]: PIXI.Texture;
}

/**
 * 坐标点的接口
 */
export interface pointCoord {
  /**
   * x坐标
   */
  x: number;
  /**
   * y坐标
   */
  y: number;
}

/**
 * 传入参数
 */
export interface iprops {
  //材质
  textures: textureArrCatch;
  //是否已经开始动画
  setIsAnimate: (isAnimate: boolean) => void;
}

//获得两点之间的距离
const getLength = function (p1: pointCoord, p2: pointCoord): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

//获得一个随机数
const getRand = function (Max: number, Min: number): number {
  var Range = Max - Min;
  var Rand = Math.random();
  if (Math.round(Rand * Range) == 0) {
    return Min + 1;
  }
  var num = Min + Math.round(Rand * Range);
  return num;
};

const MainBanner: FC<iprops> = (
  { textures, setIsAnimate },
  _ref
): ReactElement => {
  //===============useHooks=================

  //===============state====================
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [intersectionRatio, setintersectionRatio] = useState<number>(0);
  /**
   * 画布容器的真实宽高(px)
   */
  const [cHeight, setcHeight] = useState<number>(0);
  const [cWidth, setcWidth] = useState<number>(0);

  //===============static===================

  //===============ref======================
  const container = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const IntersectionObserverRef = useRef<IntersectionObserver>();

  //===============function=================
  const loadData = async function (): Promise<void> {};

  /**
   *创建reasize
   */
  const createResizeObserver = function () {
    if (container.current !== null) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const width = entries[0].contentRect.width;
          const height = entries[0].contentRect.height;
          //界面的初始宽度
          let org_width = 1920;
          //界面的初始长度
          let org_height = 1283;

          let rato = width / org_width;
          setcWidth(width);
          setcHeight(org_height * rato);
        }
      });
      resizeObserverRef.current.observe(container.current);
    }
  };

  /**
   *清除resize
   */
  const clearObserver = function () {
    if (resizeObserverRef.current !== null) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
  };

  //===============effects==================
  useEffect(
    function (): ReturnType<React.EffectCallback> {
      if (isMounted === false) {
        setIsMounted(true);
        if (container.current !== null) {
          createResizeObserver();
        }
      }
    },
    [isMounted]
  );

  useEffect(function (): ReturnType<React.EffectCallback> {
    return function (): void {
      setIsMounted(false);
      clearObserver();
    };
  }, []);

  return (
    <>
      <div
        ref={container}
        className={"container"}
        style={{ 
          backgroundColor: "#000000"
        }}
      >
        <PixiCompoent
          resolution={{
            width: 1920,
            height: 1283
          }}
          size={{
            width: cWidth,
            height: cHeight
          }}
          isFullscreen={false}
          setIsAnimate={setIsAnimate}
          textures={textures}
          Loaded={function () {
            //载入完成
          }}
          isPlayAnimate={false}
        />
      </div>
    </>
  );
};

interface StageProps {
  /**
   * 分辨率
   */
  resolution: {
    width: number;
    height: number;
  };
  /*
   *画布的实体大小
   */
  size: {
    width: number;
    height: number;
  };
  /**
   * 是否全屏显示
   */
  isFullscreen: boolean;
  /**
   * 是否播放动画
   */
  setIsAnimate: (isAnimate: boolean) => void;
  /**
   * 已经预加载的材质
   */
  textures: textureArrCatch;
  Loaded?: () => void;
  isPlayAnimate: boolean;
}

const PixiCompoent: FC<StageProps> = function ({
  resolution,
  size,
  isFullscreen,
  setIsAnimate,
  textures,
  Loaded,
  isPlayAnimate
}) {
  //===============useHooks================
  const $ = useJquery();
  const ticker = PIXI.ticker.shared;

  //-----------------------------state------------------------
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isFinishedStartAnimate, setisFinishedStartAnimate] = useState<boolean>(
    false
  );
  const [keepTemp, setkeepTemp] = useState<number>(0);
  const [keepbacklightRefTemp, setkeepbacklightRefTemp] = useState<number>(0);
  const [cpLength, setcpLength] = useState<pointCoord>({
    x: 0,
    y: 0
  });
  const [intersectionRatio, setintersectionRatio] = useState<number>(0);

  //狗狗图片的图形范围
  const [imageScop, setimageScope] = useState<Array<Array<0 | 1>>>([]);

  //-----------------------------ref------------------------
  const IntersectionObserverRef = useRef<IntersectionObserver>();
  const container = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<Sprite>(null);
  const ring2Ref = useRef<Sprite>(null);
  const ring3Ref = useRef<Sprite>(null);
  const backlightRef = useRef<Sprite>(null);
  const dogRef = useRef<Sprite>(null);
  const logo_shadowRef = useRef<Sprite>(null);
  const logoRef = useRef<Sprite>(null);
  const dotsRef = useRef<Sprite>(null);
  const dotsMartixRef = useRef<Sprite>(null);

  const dotProps = useRef<any>([]);
  const yellowdotProps = useRef<any>([]);
  const triangleRef = useRef<any>([]);
  const bigDotsRef = useRef<any>([]);
  const sideDotsRef = useRef<any>([]);

  //动画
  const animations = useRef<any>([]);

  //-----------------------------static------------------------
  // 创建一个新的Image对象
  let dogImage = new Image();

  /*
   *------------------------------------------------------function----------------------------------------------------
   */

  /**
   *创建视窗观察器
   */
  const createIntersectionObserver = function () {
    IntersectionObserverRef.current = new IntersectionObserver(
      function (entries: IntersectionObserverEntry[]) {
        setintersectionRatio(entries[0].intersectionRatio);
      },
      {
        threshold: (function () {
          let arr: number[] = [];
          for (var i = 0; i < 100; i++) {
            arr.push(i / 100);
          }
          return arr;
        })()
      }
    );
    if (container.current !== null) {
      IntersectionObserverRef.current.observe(container.current);
    }
  };

  const mousemoveAni = function (_e: any) {
    let cPoint = {
      x: $(window).width() / 2,
      y: $(window).height() / 2
    };

    let _cplength = {
      x: cPoint.x - _e.originalEvent.x,
      y: cPoint.y - _e.originalEvent.y
    };

    setcpLength(_cplength);
  };

  /**
   * 动画，支持await
   */
  //缓动的公用函数
  const enYmAtE = async function <T, D>(
    _animateStartObj: T,
    _animateEndObj: D,
    duration: number = 1000,
    ease: string = "linear",
    delayTime: number = 0,
    step: (elem: any) => void = function (elem) {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let ani = $(_animateStartObj)
        .delay(delayTime)
        .animate(_animateEndObj, {
          duration: duration,
          easing: ease,
          step: function () {
            if (typeof step !== "undefined") {
              step(this);
            }
          },
          complete: function () {
            resolve();
          }
        });
      animations.current.push(ani);
    });
  };
  //停止所有动画
  const stopAnimations = function () {
    for (let i = 0; i < animations.current.length; i++) {
      animations.current[i].stop();
    }
  };

  /**
   * 开场动画
   */
  const startUpanimate = async function () {
    let scope = 80;
    setIsAnimate(true);
    //纵向刷新
    await enYmAtE(
      {
        scope: 0
      },
      {
        scope: 1080
      },
      500,
      "linear",
      0,
      function (elem) {
        for (var i of dotProps.current) {
          for (var k of i) {
            let start = elem.scope + scope;
            let end = elem.scope;

            try {
              if (k.current.y < start) {
                let currentYpositon = k.current.y - end;
                let precent = currentYpositon / scope;
                k.current.alpha = 1 - precent;
              }

              if (k.current.y < end) {
                k.current.alpha = 0.1;
              }
            } catch (_e) {}
          }
        }
      }
    );

    let pointStart: pointCoord = { x: 1398, y: 563 };

    //圆形刷新，刷出狗影子
    await enYmAtE(
      {
        scope: 0
      },
      {
        scope: 1600
      },
      1000,
      "easeInOutCubic",
      0,
      function (elem) {
        let y = 0;
        for (var i of dotProps.current) {
          let x = 0;
          for (var k of i) {
            try {
              let start = elem.scope + scope;
              let end = elem.scope;

              let distance = getLength(pointStart, {
                x: k.current.x,
                y: k.current.y
              });

              if (distance < start) {
                let currentYpositon = distance - end;
                let precent = currentYpositon / scope;
                k.current.alpha = 1 - precent;
              }

              if (distance < end) {
                k.current.alpha = 0.1;
              }

              if (
                distance < end &&
                typeof imageScop[Number(k.current.y.toFixed(0))] !==
                  "undefined" &&
                imageScop[Number(k.current.y.toFixed(0))].length !== 0
              ) {
                if (
                  imageScop[Number(k.current.y.toFixed(0))][
                    Number(k.current.x.toFixed(0))
                  ] === 1
                ) {
                  k.current.alpha = 1;
                  yellowdotProps.current[y][x].current.alpha = 1;
                } else {
                  k.current.alpha = 0.1;
                }
              }
              x++;
            } catch (_e) {}
          }
          y++;
        }
      }
    );

    let ani_1 = enYmAtE(
      {
        scope: 0
      },
      {
        scope: 500
      },
      700,
      "easeInOutCubic",
      0,
      function (elem) {
        let y = 0;
        for (var i of dotProps.current) {
          let x = 0;
          for (var k of i) {
            try {
              let start = elem.scope + scope;
              let end = elem.scope;

              let distance = getLength(pointStart, {
                x: k.current.x,
                y: k.current.y
              });

              if (distance < start) {
                let currentYpositon = distance - end;
                let precent = currentYpositon / scope;
                k.current.alpha = 1 - precent;

                if (
                  typeof imageScop[Number(k.current.y.toFixed(0))] !==
                    "undefined" &&
                  imageScop[Number(k.current.y.toFixed(0))].length !== 0
                ) {
                  if (
                    imageScop[Number(k.current.y.toFixed(0))][
                      Number(k.current.x.toFixed(0))
                    ] === 1
                  ) {
                    yellowdotProps.current[y][x].current.alpha = 1 - precent;
                  }
                }
              }

              if (distance < end) {
                k.current.alpha = 0;
                k.current.visible = false;
                if (
                  typeof imageScop[Number(k.current.y.toFixed(0))] !==
                    "undefined" &&
                  imageScop[Number(k.current.y.toFixed(0))].length !== 0
                ) {
                  if (
                    imageScop[Number(k.current.y.toFixed(0))][
                      Number(k.current.x.toFixed(0))
                    ] === 1
                  ) {
                    yellowdotProps.current[y][x].current.alpha = 0;
                  }
                }
              }
              x++;
            } catch (_e) {}
          }
          y++;
        }
      }
    );

    ring2Ref.current!.alpha = 1;
    ring3Ref.current!.alpha = 1;
    ring1Ref.current!.alpha = 1;

    let ani2 = enYmAtE(
      dogRef.current!,
      {
        alpha: 1
      },
      500,
      "easeInOutCubic",
      200
    );

    await Promise.all([ani_1, ani2]);

    ani_1 = enYmAtE(
      {
        scope: 500
      },
      {
        scope: 600
      },
      600,
      "linear",
      0,
      function (elem) {
        let y = 0;
        for (var i of dotProps.current) {
          let x = 0;
          for (var k of i) {
            try {
              let start = elem.scope + scope;
              let end = elem.scope;

              let distance = getLength(pointStart, {
                x: k.current.x,
                y: k.current.y
              });

              if (distance < start) {
                let currentYpositon = distance - end;
                let precent = currentYpositon / scope;
                k.current.alpha = 1 - precent;

                if (
                  typeof imageScop[Number(k.current.y.toFixed(0))] !==
                    "undefined" &&
                  imageScop[Number(k.current.y.toFixed(0))].length !== 0
                ) {
                  if (
                    imageScop[Number(k.current.y.toFixed(0))][
                      Number(k.current.x.toFixed(0))
                    ] === 1
                  ) {
                    yellowdotProps.current[y][x].current.alpha = 1 - precent;
                  }
                }
              }

              if (distance < end) {
                k.current.alpha = 0;
                k.current.visible = false;
                if (
                  typeof imageScop[Number(k.current.y.toFixed(0))] !==
                    "undefined" &&
                  imageScop[Number(k.current.y.toFixed(0))].length !== 0
                ) {
                  if (
                    imageScop[Number(k.current.y.toFixed(0))][
                      Number(k.current.x.toFixed(0))
                    ] === 1
                  ) {
                    yellowdotProps.current[y][x].current.alpha = 0;
                  }
                }
              }
              x++;
            } catch (_e) {}
          }
          y++;
        }
      }
    );

    let ani5 = enYmAtE(
      ring2Ref.current!.scale,
      {
        x: 1,
        y: 1
      },
      500,
      "easeInOutCubic"
    );

    let ani6 = enYmAtE(
      ring3Ref.current!.scale,
      {
        x: 1,
        y: 1
      },
      500,
      "easeInOutCubic"
    );

    let ani7 = enYmAtE(
      backlightRef.current!,
      {
        alpha: 1
      },
      500,
      "easeInOutCubic"
    );

    await Promise.all([
      //
      ani_1,
      ani5,
      ani6,
      ani7
    ]);

    ani_1 = enYmAtE(
      {
        scope: 600
      },
      {
        scope: 1600
      },
      1200,
      "easeInOutCubic",
      0,
      function (elem) {
        let y = 0;
        for (var i of dotProps.current) {
          let x = 0;
          for (var k of i) {
            try {
              let start = elem.scope + scope;
              let end = elem.scope;

              let distance = getLength(pointStart, {
                x: k.current.x,
                y: k.current.y
              });

              if (distance < start) {
                let currentYpositon = distance - end;
                let precent = currentYpositon / scope;
                k.current.alpha = 1 - precent;

                if (
                  typeof imageScop[Number(k.current.y.toFixed(0))] !==
                    "undefined" &&
                  imageScop[Number(k.current.y.toFixed(0))].length !== 0
                ) {
                  if (
                    imageScop[Number(k.current.y.toFixed(0))][
                      Number(k.current.x.toFixed(0))
                    ] === 1
                  ) {
                    yellowdotProps.current[y][x].current.alpha = 1 - precent;
                  }
                }
              }

              if (distance < end) {
                k.current.alpha = 0;
                k.current.visible = false;
                if (
                  typeof imageScop[Number(k.current.y.toFixed(0))] !==
                    "undefined" &&
                  imageScop[Number(k.current.y.toFixed(0))].length !== 0
                ) {
                  if (
                    imageScop[Number(k.current.y.toFixed(0))][
                      Number(k.current.x.toFixed(0))
                    ] === 1
                  ) {
                    yellowdotProps.current[y][x].current.alpha = 0;
                  }
                }
              }
              x++;
            } catch (_E) {}
          }
          y++;
        }
      }
    );

    let ani8 = enYmAtE(
      dotsMartixRef.current!,
      {
        alpha: 1
      },
      1200,
      "easeInOutCubic"
    );
    let ani9 = enYmAtE(
      logoRef.current!,
      {
        alpha: 1
      },
      1200,
      "easeInOutCubic"
    );

    let ani10 = enYmAtE(
      logo_shadowRef.current!,
      {
        alpha: 1
      },
      1200,
      "easeInOutCubic"
    );

    let ani11 = inittriangle();
    initBigDots();
    initSideDots();

    enYmAtE(
      ring1Ref.current!,
      {
        angle: 45
      },
      1200,
      "linear"
    );
    let ani12 = enYmAtE(
      ring1Ref.current!.scale,
      {
        x: 1,
        y: 1
      },
      1200,
      "easeInOutCubic"
    );

    await Promise.all([
      //
      ani_1,
      ani8,
      ani9,
      ani10,
      ani11,
      ani12
    ]);

    setisFinishedStartAnimate(true);
  };

  /**
   * 初始化三角形
   */
  const inittriangle = async function () {
    let aniArr: any = [];
    let count = 0;
    for (var i of triangleRef.current) {
      i.current.x = count * 63;
      aniArr.push(
        enYmAtE(
          i.current!,
          {
            alpha: 1
          },
          1200,
          "easeInOutCubic"
        )
      );
      count++;
    }

    await Promise.all(aniArr);
  };

  /**
   * 初始化圆点
   */
  const initBigDots = async function () {
    let aniArr: any = [];
    let count = 0;
    for (var i of bigDotsRef.current) {
      i.current.x = count * 114;
      aniArr.push(
        enYmAtE(
          i.current!,
          {
            alpha: 1
          },
          1200,
          "easeInOutCubic"
        )
      );
      count++;
    }

    await Promise.all(aniArr);
  };

  /**
   * 初始化侧面圆点
   */
  const initSideDots = async function () {
    let aniArr: any = [];
    let count = 0;
    for (var i of sideDotsRef.current) {
      i.current.y = count * 22;
      aniArr.push(
        enYmAtE(
          i.current!,
          {
            alpha: 1
          },
          1200,
          "easeInOutCubic"
        )
      );
      count++;
    }

    await Promise.all(aniArr);
  };

  /**
   * 循环动画
   */
  const loopanimation = function () {
    looptriangle();
    loopbigDots();
    loopSideDots();
  };

  const looptriangle = async function () {
    let aniArr: any = [];
    let count = 0;
    for (var i of triangleRef.current) {
      let rand = getRand(0, 1);
      try {
        if (rand > 0.5) {
          i.current.texture = getImageTexture(tr_1);
        } else {
          i.current.texture = getImageTexture(tr_2);
        }
      } catch (_e) {}
      aniArr.push(
        enYmAtE(
          i.current!,
          {
            alpha: getRand(2, 10) / 10
          },
          getRand(500, 2000),
          "easeInOutCubic"
        )
      );
      count++;
    }

    await Promise.all(aniArr);
    looptriangle();
  };

  const loopbigDots = async function () {
    let aniArr: any = [];
    let count = 0;
    for (var i of bigDotsRef.current) {
      let rand = getRand(0, 1);
      try {
        if (rand > 0.5) {
          i.current.texture = getImageTexture(c_1);
        } else {
          i.current.texture = getImageTexture(c_2);
        }
      } catch (_e) {}
      aniArr.push(
        enYmAtE(
          i.current!,
          {
            alpha: getRand(2, 10) / 10
          },
          getRand(500, 2000),
          "easeInOutCubic"
        )
      );
      count++;
    }

    await Promise.all(aniArr);
    loopbigDots();
  };

  const loopSideDots = async function () {
    let aniArr: any = [];
    let count = 0;
    for (var i of sideDotsRef.current) {
      aniArr.push(
        enYmAtE(
          i.current!,
          {
            alpha: getRand(0, 1)
          },
          getRand(500, 2000),
          "easeInOutCubic"
        )
      );
      count++;
    }

    await Promise.all(aniArr);
    loopSideDots();
  };

  /**
   * 点闪烁一次
   */
  const shineDotOnce = async function (startAlpha: number, endAlpha: number) {};

  /**旋转 */
  const rotateRing1 = async function () {
    if (isMounted === true) {
      ring1Ref.current!.angle = 0;
      await enYmAtE(
        ring1Ref.current!,
        {
          angle: 360
        },
        5 * 1000
      );
      setkeepTemp(+new Date());
    }
  };

  /**背景循环呼吸灯 */
  const backL = async function () {
    if (isMounted === true) {
      await enYmAtE(
        backlightRef.current!,
        {
          alpha: 0.2
        },
        getRand(2 * 500, 5 * 1000)
      );
      await enYmAtE(
        backlightRef.current!,
        {
          alpha: 1
        },
        getRand(2 * 500, 5 * 1000)
      );
      setkeepbacklightRefTemp(+new Date());
    }
  };

  const getImageTexture = function (_url: string): any {
    if (isRunningInServer) {
      return PIXI.Texture.EMPTY;
    } else {
      if (typeof textures[_url] !== "undefined") {
        return textures[_url];
      }
      return PIXI.Texture.from(_url);
    }
  };

  /**
   * 关闭视窗观察器
   */
  const stopIntersectionObserver = function () {
    IntersectionObserverRef.current?.disconnect();
    delete IntersectionObserverRef.current;
  };

  const initImage = function () {
    // 指定图像的路径
    dogImage.src = mask + "?" + new Date().getTime();
    dogImage.setAttribute("crossOrigin", "");
    dogImage.onload = function () {
      getImageData(dogImage);
    };
  };

  const getImageData = function (image: HTMLImageElement) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const ctx = tempCanvas.getContext("2d");

    // 在临时Canvas上绘制图像
    ctx!.drawImage(image, 0, 0);

    // 获取图像像素数据
    const imageData = ctx!.getImageData(
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );
    const pixels = imageData.data;

    let dataSet: any = [];
    let rowData: Array<0 | 1> = [];
    let linePosition = 0;
    let rowPosition = 0;

    // 遍历每个像素
    for (let i = 0; i < pixels.length; i += 4) {
      if (linePosition === 1920) {
        linePosition = 0;
        rowPosition++;
        dataSet.push(rowData);
        rowData = new Array();
      }

      let alpha = pixels[i + 3];
      if (alpha > 50) {
        rowData.push(1);
      } else {
        rowData.push(0);
      }

      linePosition++;
    }

    setimageScope(dataSet);
  };

  //批量生产精灵
  const genSprites = function <T extends { key?: number; ref?: any }>(
    _Sprite: T,
    _count: number,
    _refs: React.MutableRefObject<Array<T>>
  ): Array<T> {
    var Sprites: Array<T> = [];
    for (var i = 0; i < _count; i++) {
      let item = { ..._Sprite };
      item.key = i;
      item.ref = React.createRef();
      _refs.current[i] = item.ref;
      Sprites.push(item);
    }
    return Sprites;
  };

  const makeDots = function (
    _propsRef: any,
    width: number,
    height: number,
    widthCount: number,
    heightCount: number,
    isYellowDots: boolean
  ) {
    if (isFinishedStartAnimate) {
      return null;
    }
    let pElements: any = [];
    let pRefs = [];
    for (var i = 0; i < heightCount; i++) {
      for (var k = 0; k < widthCount; k++) {
        (function () {
          if (typeof _propsRef.current[i] === "undefined") {
            _propsRef.current[i] = [];
          }
          let wLength = width / widthCount;
          let hLength = height / heightCount;
          let props = {
            x: k * wLength,
            y: i * hLength,
            alpha: 0,
            wh: 8,
            showgraph: false,
            visible: true
          };

          let _prop = props;

          if (
            typeof imageScop[Number(props.y.toFixed(0))] !== "undefined" &&
            imageScop[Number(props.y.toFixed(0))].length !== 0
          ) {
            if (
              imageScop[Number(props.y.toFixed(0))][
                Number(props.x.toFixed(0))
              ] === 1
            ) {
              _prop.showgraph = true;
            } else {
              _prop.showgraph = false;
            }
          }

          if (isYellowDots && _prop.showgraph === false) {
          } else {
            let item = {
              ...(
                <Sprite
                  key={i + "_" + k}
                  texture={getImageTexture(
                    (function () {
                      if (isYellowDots) {
                        return dotsMartix_item_g;
                      } else {
                        return dotsMartix_item_w;
                      }
                    })()
                  )}
                  x={_prop.x}
                  y={_prop.y}
                  anchor={new PIXI.Point(0.5, 0.5)}
                  width={_prop.wh}
                  height={_prop.wh}
                  alpha={_prop.alpha}
                  visible={_prop.visible}
                />
              )
            };
            ((item as unknown) as {
              key?: number;
              ref?: any;
            }).ref = React.createRef();
            _propsRef.current[i][k] = ((item as unknown) as {
              key?: number;
              ref?: any;
            }).ref;
            pElements.push(item);
          }
        })();
      }
    }
    return pElements;
  };

  /*
   *------------------------------------------------------所有动画: 开始----------------------------------------------------
   */

  /*
   *------------------------------------------------------所有动画：结束----------------------------------------------------
   */

  //===============effects==================
  useEffect(
    function (): ReturnType<React.EffectCallback> {
      if (isMounted === false) {
        setIsMounted(true);
        initImage();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  );

  useEffect(
    function (): ReturnType<React.EffectCallback> {
      if (isMounted && isFinishedStartAnimate) {
        rotateRing1();
        backL();
        loopanimation();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted, isFinishedStartAnimate]
  );

  useEffect(
    function (): ReturnType<React.EffectCallback> {
      if (imageScop.length !== 0) {
        startUpanimate();
        $(document).bind("mousemove", mousemoveAni);
        createIntersectionObserver();
        ticker.start();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageScop]
  );

  useEffect(
    function (): ReturnType<React.EffectCallback> {
      rotateRing1();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keepTemp]
  );

  useEffect(
    function (): ReturnType<React.EffectCallback> {
      backL();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keepbacklightRefTemp]
  );

  useEffect(function (): ReturnType<React.EffectCallback> {
    return function (): void {
      setIsMounted(false);
      stopAnimations();
      $(document).unbind("mousemove", mousemoveAni);
      stopIntersectionObserver();
      ticker.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={container}
        style={{
          overflow: "hidden",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: "-1"
        }}
      ></div>

      <Stage
        options={{
          backgroundAlpha: 1,
          backgroundColor: 0x000000,
          /**
           * 这里设置分辨率
           */
          width: resolution.width,
          height: resolution.height,
          autoStart: false,
          sharedTicker: true,
          resolution: 1
        }}
        style={{
          /**
           * 这里设置真实大小
           */
          width: size.width + "px",
          height: size.height + "px",
          backgroundColor: "rgba(0,0,0,0)"
        }}
      >
        <Container>
          {makeDots(dotProps, 1920, 1000, 1920 / 15, 1000 / 15, false)}
          {makeDots(yellowdotProps, 1920, 1000, 1920 / 15, 1000 / 15, true)}
        </Container>
        <Container
          x={467}
          y={644}
        >
          {genSprites(
            //
            <Sprite
              texture={getImageTexture(tr_1)}
              width={49}
              height={58}
              alpha={0}
            />,
            6,
            triangleRef as React.MutableRefObject<any[]>
          )}
        </Container>

        <Container
          x={516}
          y={727}
        >
          {genSprites(
            //
            <Sprite
              texture={getImageTexture(c_1)}
              width={35}
              height={35}
              alpha={0}
            />,
            5,
            bigDotsRef as React.MutableRefObject<any[]>
          )}
        </Container>
        <Container
          x={1751}
          y={252}
        >
          {genSprites(
            //
            <Sprite
              texture={getImageTexture(c_r)}
              width={17}
              height={17}
              alpha={0}
            />,
            15,
            sideDotsRef as React.MutableRefObject<any[]>
          )}
        </Container>
        <Sprite
          alpha={0}
          texture={getImageTexture(light)}
          width={1920}
          height={1283}
          ref={backlightRef}
        />
        <Container
          x={1379}
          y={535 - (1 - intersectionRatio) * 100}
        >
          <Sprite
            alpha={0}
            texture={getImageTexture(ring2)}
            width={706}
            height={706}
            anchor={new PIXI.Point(0.5, 0.5)}
            ref={ring2Ref}
            scale={0}
          />
          <Sprite
            alpha={0}
            texture={getImageTexture(ring3)}
            width={706}
            height={706}
            anchor={new PIXI.Point(0.5, 0.5)}
            ref={ring3Ref}
            scale={0}
          />
          <Sprite
            alpha={0}
            texture={getImageTexture(ring1)}
            width={706}
            height={706}
            anchor={new PIXI.Point(0.5, 0.5)}
            ref={ring1Ref}
            scale={0}
            angle={0}
          />
        </Container>

        <Sprite
          texture={getImageTexture(dotsMartix)}
          width={1920}
          height={1283}
          x={699}
          y={455 - (1 - intersectionRatio) * 60}
          angle={-(1 - intersectionRatio) * 60}
          anchor={
            new PIXI.Point(699 / resolution.width, 455 / resolution.height)
          }
          alpha={0}
          ref={dotsMartixRef}
        />

        <Sprite
          texture={getImageTexture(dog)}
          width={1920}
          height={1283}
          x={0}
          y={-(1 - intersectionRatio) * 200}
          alpha={0}
          ref={dogRef}
        />

        <Sprite
          texture={getImageTexture(logo_shadow)}
          width={1920}
          height={1283}
          x={cpLength.x / 150}
          y={-((1 - intersectionRatio) * 80)}
          alpha={0}
          ref={logo_shadowRef}
        />
        <Sprite
          texture={getImageTexture(logo)}
          width={1920}
          height={1283}
          x={cpLength.x / 50}
          y={-((1 - intersectionRatio) * 200)}
          alpha={0}
          ref={logoRef}
        />
      </Stage>
    </>
  );
};
export default MainBanner;
