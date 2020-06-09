import { Button as BPButton, Classes } from '@blueprintjs/core'
import styled from 'styled-components'
import { darken } from 'polished'

export const Button = styled(BPButton)`
  && {
    background-image: none;
    background-color: ${(props) => props.theme.secondaryColor};
    color: ${(props) => props.theme.buttonTextColor};
    border-radius: 3px;

    &:hover {
      color: ${(props) => props.theme.buttonTextColor};
      background-color: ${(props) => darken(0.1, props.theme.secondaryColor)};
    }

    .${Classes.ICON} {
      color: inherit;
    }
  }

  &&,&&:hover {
    border: none;
    box-shadow: none;
  }

  &&.${Classes.MINIMAL} {
    background-color: transparent;
  }

  &&.${Classes.INTENT_PRIMARY} {
    background-color: ${(props) => props.theme.primaryColor};

    &:hover {
      color: ${(props) => props.theme.buttonTextColor};
      background-color: ${(props) => darken(0.1, props.theme.primaryColor)};
    }
  }

  &&.${Classes.INTENT_DANGER} {
    background-color: ${(props) => props.theme.tertiaryColor};

    &:hover {
      color: ${(props) => props.theme.buttonTextColor};
      background-color: ${(props) => darken(0.1, props.theme.tertiaryColor)};
    }
  }
`