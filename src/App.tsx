import { useCallback } from 'react'
import { defaultOptions } from './data/options'
import { useTournament } from './hooks/useTournament'
import Starfield from './components/Starfield'
import SetupScreen from './components/SetupScreen'
import BattleScreen from './components/BattleScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const t = useTournament()
  const start = useCallback(() => t.start(defaultOptions), [t.start])
  let screen
  if (t.phase === 'battle' && t.current) {
    screen = (
      <BattleScreen
        left={t.current.left}
        right={t.current.right}
        round={t.round}
        total={t.total}
        knockout={t.current.knockout}
        onPick={t.pick}
        onQuit={t.backToSetup}
      />
    )
  } else if (t.phase === 'result') {
    screen = <ResultScreen ranking={t.ranking} onReplay={t.replay} onHome={t.backToSetup} />
  } else {
    screen = <SetupScreen options={defaultOptions} onStart={start} />
  }

  return (
    <>
      <Starfield />
      {screen}
    </>
  )
}
