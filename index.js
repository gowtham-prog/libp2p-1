const libp2p = require('libp2p')
const { noise } = require('@chainsafe/libp2p-noise')
const { webRTCDirect } = require('@libp2p/webrtc')

async function createLibp2p() {
  const libp2 = await libp2p.createLibp2p({
    // Use webRTCDirect() as a transport
    // to enable WebRTC support
    modules: {
      transport: [webRTCDirect()],
      connEncryption: [noise()]
    }
  })

  return libp2
}

async function main() {
  const lib = await createLibp2p()

  // Print the local peer ID
  console.log('Local Peer ID:', lib.peerStore.id.toB58String())

  const peerId = 'QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'

  const stream = await lib.dial(peerId)

  stream.onmessage = event => {
    console.log('Received:', event.data)
  }

  const message = 'Hello, world!'
  await stream.write(message)
}

main().catch(err => console.error('Error:', err))
