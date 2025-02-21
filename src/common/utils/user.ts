export const RenderMedals = (position: number): string => {

  switch (position) {
    case 0:
      return '🥇'

    case 1:
      return '🥈'

    case 2:
      return '🥉'


    default:
      return ''

  }

} 