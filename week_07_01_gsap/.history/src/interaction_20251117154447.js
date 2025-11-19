import gsap from 'gsap'

export const interaction = (currentMesh) => {
    gsap.to('.left',  {
        currentMesh.rotation.y = 0
    })
}
