import { createServer } from 'http'
import express from 'express';
import { Server, Socket } from "socket.io";
// import { StrictEventEmitter } from 'socket.io/dist/typed-events';

import { randBetween } from '../scripts/utility/math'
// import { Tank } from '../scripts/objects/tank';

const app = express();
const port = process.env.PORT || 4000;
const server = createServer(app);  
const io = new Server(server, {
    pingTimeout: 5000,
    connectTimeout: 10000,
    pingInterval: 1000,
});

// Blue color is playing the right side
// Red  color is playing the left  side
export enum Color {
    Blue = 0,
    Red = 1
}

export type Tank = {
    color: Color,
    x: number,
    y: number,
}

// Player zero is Blue tank
// Player one  is Red  tank
type Player = {
    socket: Socket,
    tank: Tank
};

export type Terrain = {
    width: number,
    height: number,
    surfaceNoiseSeed: number[],
}

const WIDTH  = 800;
const HEIGHT = 600;

let players: Player[] = [];
let terrain: Terrain = {
    width: WIDTH,
    height: HEIGHT,
    surfaceNoiseSeed: [...Array(WIDTH)].map(Math.random),
}

let tankBlue: Tank = {
    color: 0,
    x: randBetween(0, terrain.width * 0.3),
    y: 0,
};

let tankRed: Tank = {
    color: Color.Red,
    x: randBetween(terrain.width * 0.7, terrain.width),
    y: 0,
};

io.on("connection", (socket: Socket) => {

    console.log(`Player with socket ${socket.id} has connected`);

    console.log('Current players ID');
    players.forEach((player) => {
        console.log(player.socket.id);
    });

    // console.log('A player has connected');

    // If room is filled dc them
    if (players.length >= 2) {
        socket.send('The room is full. Sorry!');
        socket.disconnect(true);
        return
    }

    let you: Tank, enemy: Tank;

    if (players.length === 0) {
        you = tankBlue;
        enemy = tankRed
    } else {
        you = tankRed;
        enemy = tankBlue;
    }

    let player: Player = { socket: socket, tank: you};

    players.push(player);
    socket.send(`Hello there! You are player ${you.color} `);

    io.to(socket.id).emit('init-tanks', you, enemy);
    socket.emit('init-terrain', terrain);

    socket.on('exit', () => {
        // let isPlayerIsInTheList = players.some( player => {
        //     return player.socket.id === socket.id
        // });
    
        // console.log('Was player in the list: ', isPlayerIsInTheList);

        // if (isPlayerIsInTheList) {
        //     socket.send(`A player has left. Game Over.`);
        //     socket.emit('game-over');
        // }
    });

    socket.on('disconnect', (reason) => {

        console.log('A player has disconnect');
    
        let isPlayerIsInTheList = players.some( player => {
            return player.socket.id === socket.id
        });
    
        console.log('Was player in the list: ', isPlayerIsInTheList);

        if (isPlayerIsInTheList) {
            socket.send(`A player has left. Game Over.`);
            socket.emit('game-over');
        }

    });

});
  

server.listen(port);