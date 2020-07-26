import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'

const scene = new Scene()
const camera = new PerspectiveCamera(90, 1, 0.1, 100)
const renderer = new WebGLRenderer({})

