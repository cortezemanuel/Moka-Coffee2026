# Backend - Productos y Carritos

## Descripción

API REST para gestionar productos y carritos con MongoDB.

## Tecnologías

Node.js
Express
MongoDB
Mongoose

## Configuración

Crear archivo .env:

MONGO_URI=tu_uri
PORT=8080

## Ejecutar

npm install
npm run dev

## Endpoints

Productos
GET /api/products
POST /api/products

Carritos
POST /api/carts
GET /api/carts/:cid
POST /api/carts/:cid/product/:pid
