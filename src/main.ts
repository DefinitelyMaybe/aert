import { Scene, PerspectiveCamera, WebGLRenderer } from './mod.ts'

const scene = new Scene()
const camera = new PerspectiveCamera(90, 1, 0.1, 100)
const renderer = new WebGLRenderer({})