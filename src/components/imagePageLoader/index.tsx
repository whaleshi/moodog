/**
 * 廖力编写
 * 模块名称：
 * 模块说明：
 * 编写时间：
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
export interface textureArrCatch {
  [propName: string]: PIXI.Texture<PIXI.Resource>;
}

/**
 * 传入参数
 */
export interface iprops {
  imageList: any[];
  setIsfinished: (_value: boolean) => void;
  setTextures: (_value: textureArrCatch) => void;
}

const ImagePageLoader: FC<iprops> = (
  { setIsfinished, setTextures, imageList = [] },
  _ref
): ReactElement => {
  const $: jQueryObject = useJquery();

  /**
   * 载入层
   */
  const loaddiingLay = useRef<HTMLTableElement>(null);

  /**
   * 是否已加载界面
   */
  let [isMonted, setIsmonted] = useState<boolean>(false);
  /**
   * 资源总数
   */
  const [totalCount, setTotalCount] = useState<number>(imageList.length);
  /**
   * 已载入数量
   */
  const [finishedCount, setFinishedCount] = useState<number>(0);

  /**
   * 载入资源
   */
  const loadingAsserts = function () {
    var _finishedCount = 0;
    var textures: textureArrCatch = {};
    var complete = function (_pic: HTMLImageElement, _item: string) {
      _finishedCount++;
      setFinishedCount(_finishedCount);
      let base = new PIXI.BaseTexture(_pic);
      let texture: PIXI.Texture<PIXI.Resource> = new PIXI.Texture(base);
      textures[_item] = texture;
      if (_finishedCount === totalCount) {
        setIsfinished(true);
        setTextures(textures);
      }
    };

    let k = 1;
    for (let item of imageList) {
      item = item;
      (function (_item, _k) {
        var pic = new Image();
        pic.setAttribute("crossOrigin", "");
        $(pic).appendTo("body");
        $(pic).bind("load", function (_e: Event) {
          complete(pic, _item);
          $(pic).remove();
        });
        $(pic).attr("src", _item);
      })(item, k);
      k++;
    }
  };

  useEffect(function () {
    if (isMonted === false) {
      setIsmonted(true);
      loadingAsserts();
    }

    return function () {
      setIsmonted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    function () {
      if (finishedCount === totalCount) {
        $("html,body").css("overflow", "");
      } else {
        $("html,body").css("overflow", "hidden");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalCount, finishedCount]
  );

  return (
    <>
      {(function () {
        if (finishedCount !== totalCount) {
          return (
            <>
              <div className={""}>
                <div
                  className={""}
                  style={{
                    width: (function (): string {
                      return (
                        ((finishedCount / totalCount) * 100).toString() + "%"
                      );
                    })()
                  }}
                ></div>
                {finishedCount + "/" + totalCount}
              </div>
            </>
          );
        }
      })()}
    </>
  );
};
export default ImagePageLoader;
