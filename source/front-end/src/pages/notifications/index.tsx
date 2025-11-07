import { useMemo, useState } from 'react'
import { Button } from '../../components/button/Button'
import { PageHeader } from '../../layouts/PageHeader'
import ListNotifications from './components/ListNotifications'

type ReadSwitch = 'UNREAD' | 'READ' | 'ALL'

function Notifications() {
  const [readSwitch, setReadSwitch] = useState<ReadSwitch>('UNREAD')
  const [currentPage, setCurrentPage] = useState(1)

  const params = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      readStatus: readSwitch,
    }),
    [currentPage, readSwitch],
  )

  // Reseta para página 1 quando mudar o filtro
  const handleReadSwitchChange = (newSwitch: ReadSwitch) => {
    setReadSwitch(newSwitch)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <PageHeader
          title="Notificações"
          subtitle={
            <>
              Confira suas notificações sobre eventos que ocorreram recentemente.
            </>
          }
        />

        <div className="flex">
          <Button
            label="Todas"
            variant="outline"
            outlineVariantBorderStyle="solid"
            className={`rounded-r-none ${readSwitch === 'ALL' ? 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default' : ''}`}
            onClick={() => handleReadSwitchChange('ALL')}
          />
          <Button
            label="Não lidas"
            variant="outline"
            outlineVariantBorderStyle="solid"
            className={`rounded-none ${readSwitch === 'UNREAD' ? 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default' : ''}`}
            onClick={() => handleReadSwitchChange('UNREAD')}
          />
          <Button
            label="Lidas"
            variant="outline"
            outlineVariantBorderStyle="solid"
            className={`rounded-l-none ${readSwitch === 'READ' ? 'bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default' : ''}`}
            onClick={() => handleReadSwitchChange('READ')}
          />
        </div>

        <ListNotifications
          params={params}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}

export default Notifications
