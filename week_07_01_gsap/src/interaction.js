import gsap from 'gsap'

export const interaction = (currentMesh) => {
    gsap.to(currentMesh.rotation, {
        y: 0
    })
}
