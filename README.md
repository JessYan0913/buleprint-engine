# Entwurf

## 简介

Entwurf 可以用来制作工业/建筑图纸。

## 安装

```shell
npm install -s entwurf
```

## 示例

```HTML
<div id="root"></div>
```

```javascript
import Entwurf, { fetchSvg } from "entwurf";

const entwurf = new Entwurf({
  container: "root",
  width: 800,
  height: 800,
  margin: 90,
  realWidth: 100,
  realHeight: 50,
  parts: [
    {
      name: "chair",
      image: () => fetchSvg("/img/chair.svg"),
      realWidth: 10,
      realHeight: 10,
      transfer: {
        x: 5,
        y: 5,
      },
    },
    {
      name: "desk",
      image: () => fetchSvg("/img/desk.svg"),
      realWidth: 40,
      realHeight: 20,
      transfer: {
        x: 10,
        y: 10,
      },
    },
  ],
});
```

## 项目计划

- [x] 代码重构

### Part 相关

- [x] 更改 svg 图片获取方式
- [] 数据绑定到 part
- [x] part 增加旋转参数

### Marker 相关

- [x] 增加标注文本格式化
- [] 实现纯标注（没有尺寸界线）
