// Dans la fonction de préparation des données
const prepareSessionData = () => {
  // Assurez-vous que dateTime est au bon format
  if (session.value.dateTime) {
    // Vérifiez que c'est une date valide
    const date = new Date(session.value.dateTime)
    if (isNaN(date.getTime())) {
      console.error('Date invalide:', session.value.dateTime)
      return
    }
  }
}