# 变换、Phong、反射光

## 变换
1. 倍乘、偏移、旋转(矩阵、四元数两种)
2. modelview
3. projection

## Phong

![phong公式](https://imgsa.baidu.com/baike/c0%3Dbaike60%2C5%2C5%2C60%2C20/sign=efb5a91f550fd9f9b41a5d3b4444bf4f/94cad1c8a786c9177b73d45acd3d70cf3bc75764.jpg)

## 反射光

1. 通过reflect()计算反射光线方向
2. 通过反射系数控制反射光线数量
2. 将反射光线放入追踪器中计算着色

## 任务要求

在week1光线追踪器基础上实现phong光照效果，具有如下要求：

1. 能够正确应用Phong光照模型，物体表面要求有高光效果。
2. 实现完整的摄像机，能够控制摄像机的视体范围、位置、朝向
3. 支持多次反射的镜面效果
4. [可选]采用四元数实现围绕任意轴的旋转功能

本任务预期完成时间为17.4.22前

## DEMO

![week2demo](./week2.png)
