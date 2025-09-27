import { useState, useMemo } from "react"
import { Button } from "../../components/button/Button"
import Title from "../../components/texts/Title"
import ListNotifications from "./components/ListNotifications"

type ReadSwitch = 'UNREAD' | 'READ' | 'ALL'

function Notifications() {
  const [readSwitch, setReadSwitch] = useState<ReadSwitch>('UNREAD')

  const params = useMemo(() => ({
    page: 1,
    limit: 10,
    readStatus: readSwitch,
  }), [readSwitch])

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Title align="left">Notificações</Title>
          <p className="text-primary-200 text-sm">
            Confira suas notificações sobre os agendamentos realizados
          </p>
        </div>

        {/* SWITCH BUTTONS */}
        <div className="flex">
          <Button
            label="Todas"
            variant="outline"
            outlineVariantBorderStyle="solid"
            className={`rounded-r-none ${readSwitch === 'ALL' ? 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default' : ''}`}
            onClick={() => setReadSwitch('ALL')}
          />
          <Button
            label="Não lidas"
            variant="outline"
            outlineVariantBorderStyle="solid"
            className={`rounded-none ${readSwitch === 'UNREAD' ? 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default' : ''}`}
            onClick={() => setReadSwitch('UNREAD')}
          />
          <Button
            label="Lidas"
            variant="outline"
            outlineVariantBorderStyle="solid"
            className={`rounded-l-none ${readSwitch === 'READ' ? 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default' : ''}`}
            onClick={() => setReadSwitch('READ')}
          />
        </div>

        <ListNotifications params={params} />
      </div>
    </>
  )
}

export default Notifications
