import React, { useEffect, useState } from "react";

import * as PIXI from "pixi.js";

import ImagePageLoader from "./components/imagePageLoader";

/* eslint-disable no-unused-vars */
import MainBanner from "./components/MainBanner";

import "./styles.css";

export interface textureArrCatch {
  [propName: string]: PIXI.Texture;
}

function App() {
  const [textures, settextures] = useState<textureArrCatch>();
  const [isFinishedLoad, setisFinishedLoad] = useState<boolean>(false);

  return (
    <>
      <ImagePageLoader
        setIsfinished={function (_value: boolean) {
          setisFinishedLoad(_value);
        }}
        setTextures={function (_value: textureArrCatch) {
          settextures(_value);
        }}
        imageList={[
          //这是主屏幕的图片
          require("./components/MainBanner/images/dog.png"),
          require("./components/MainBanner/images/dotsMartix.png"),
          require("./components/MainBanner/images/light.png"),
          require("./components/MainBanner/images/logo.png"),
          require("./components/MainBanner/images/logo_shadow.png"),
          require("./components/MainBanner/images/ring1_s.png"),
          require("./components/MainBanner/images/ring2_s.png"),
          require("./components/MainBanner/images/ring3_s.png"),
          require("./components/MainBanner/images/dotsMartix_item.png"),
          require("./components/MainBanner/images/dotsMartix_item_g.png"),
          require("./components/MainBanner/images/dotsMartix_item_w.png"),
          require("./components/MainBanner/images/tr_1.png"),
          require("./components/MainBanner/images/tr_2.png"),
          require("./components/MainBanner/images/c_1.png"),
          require("./components/MainBanner/images/c_2.png"),
          require("./components/MainBanner/images/c_r.png"),
          require("./components/MainBanner/images/tr_2.png"),
          require("./components/MainBanner/images/mask.png")
        ]}
      />
      {/* 首页背景 */}
      {(function () {
        if (isFinishedLoad && typeof textures !== "undefined") {
          return (
            <>
              <MainBanner textures={textures} setIsAnimate={function () { }} />
              
              {/* 介绍内容区域 */}
              <div className="intro-section">
                <div className="intro-container">
                  <div className="intro-card">
                    <h2 className="intro-title">欢迎来到 MooDog</h2>
                    <p className="intro-description">
                      体验创新的视觉效果与交互设计
                    </p>
                    <div className="intro-features">
                      <div className="feature-item">
                        <div className="feature-icon">🚀</div>
                        <div className="feature-text">高性能渲染</div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon">✨</div>
                        <div className="feature-text">炫酷特效</div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon">🎨</div>
                        <div className="feature-text">精美设计</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        } else {
          // loading 效果，可自定义样式
          return (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
              zIndex: 9999
            }}>
              <span style={{ fontSize: 24, color: '#888' }}>Loading...</span>
            </div>
          );
        }
      })()}
    </>
  );
}

export default App;
