export function register() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js'

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registrado:', registration)

          // Verifica atualizações periodicamente
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // Novo conteúdo disponível, solicita ao usuário para recarregar
                  if (
                    confirm(
                      'Nova versão disponível! Recarregar para atualizar?'
                    )
                  ) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Falha no registro do Service Worker:', error)
        })
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
