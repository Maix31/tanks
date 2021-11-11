export function randBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function isInsideCircle(x: number, y: number, radius: number) :boolean {
    // Originaly sqrt(X^2 + Y^2) = r 
    // we can get rid of the square root by squaring on both sides 
    // this is a micro optimization
    return (x*x + y*y) <= (radius * radius);
}

import { Scene } from 'phaser';

// https://en.wikipedia.org/wiki/Perlin_noise
export function perlinNoise1D(seed: number[], octaves: number, bias: number) {
    
    let output: number[] = [];

    const count = seed.length;
    for (let x = 0; x < count ; x++)
    {
        let noise = 0.0;
        let scaleAcc = 0.0;
        let scale = 1.0;

        for (let o = 0; o < octaves; o++)
        {
            let pitch = seed.length >> o;
            let sample1 = Math.floor(x / pitch) * pitch;
            let sample2 = (sample1 + pitch) % count;
            let blend = (x - sample1) / pitch;
            let sample = (1.0 - blend) * seed[sample1] + blend * seed[sample2];
            scaleAcc += scale;
            noise += sample * scale;
            scale = scale / bias;
        }
        // Scale to seed range
        output.push(noise / scaleAcc);
    }

    return output;
}