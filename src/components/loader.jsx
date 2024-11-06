import React from 'react'

import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

export const LoaderExampleText = ({loadingMessage}) => (
  <div className='AssetLoader'>
    
      <>
      <Loader size='huge' active inline='centered' >{loadingMessage}</Loader>
      </>
    
  </div>
)


