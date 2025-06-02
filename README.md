# canvas-flight-sim

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Low-poly 3D flight simulator, made in HTML Canvas with TypeScript.

---

## About

This project is a low-poly 3D flight simulator implemented using the HTML Canvas API and TypeScript. It demonstrates "3D" rendering techniques within a 2D canvas environment.

To create the illusion of 3D, the project implements a [graphics pipeline](https://en.wikipedia.org/wiki/Graphics_pipeline), including optimizations such as [frustum culling](https://en.wikipedia.org/wiki/Frustum_culling).

Terrain generation is achieved using a deterministic pseudo-random hasher to simulate [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise), with multiple layers of noise sampled for added detail.

The game generally runs between 60 and 160 frames per second, depending on the browser and device.

## Installation and Usage

1.  Clone the repository:

    ```bash
    git clone https://github.com/Kamix-08/canvas-flight-sim
    cd canvas-flight-sim
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Build the project:

    ```bash
    npm run build
    ```

    or, for a development loop with automatic recompilation:

    ```bash
    npm run dev
    ```

4.  Run the game by opening `index.html` in your browser.

## Controls

 | Key | Action     |
 | --- | ---------- |
 | `i` | Pitch up   |
 | `k` | Pitch down |
 | `j` | Roll left  |
 | `l` | Roll right |

## Contributions

Special thanks to [Krzysztof](https://github.com/Kminek2) for his invaluable assistance with debugging the graphics pipeline and contributing to game design. This project would not have been possible without him.

If you would like to contribute to the project yourself, please submit a pull request.