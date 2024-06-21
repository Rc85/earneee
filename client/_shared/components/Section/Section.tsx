import { Box, Container, Paper, SxProps, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { ElementType, FormEvent } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  actions?: any[];
  children?: any;
  titleVariant?: Variant;
  sx?: SxProps;
  elevation?:
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24;
  component?: ElementType<any>;
  variant?: 'outlined' | 'elevation';
  onSubmit?: (e?: FormEvent) => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  titleStyle?: SxProps;
  containerStyle?: SxProps;
  position?: 'left' | 'center' | 'right';
  disableGutters?: boolean;
  truncateTitle?: boolean;
  supertitle?: any;
}

const Section = ({
  title,
  subtitle,
  actions,
  children,
  titleVariant,
  sx,
  elevation = 0,
  component = 'div',
  onSubmit,
  variant = 'elevation',
  maxWidth,
  titleStyle,
  containerStyle,
  position = 'left',
  disableGutters,
  truncateTitle,
  supertitle
}: Props) => {
  let titleStyles: any = {};

  if (subtitle) {
    titleStyles.mb = 0;
  }

  if (titleStyle) {
    titleStyles = { ...titleStyles, ...titleStyle };
  }

  const positionStyle: any = {};

  if (position === 'center') {
    positionStyle.marginLeft = 'auto';
    positionStyle.marginRight = 'auto';
  } else if (position === 'right') {
    positionStyle.marginRight = 0;
  } else if (position === 'left') {
    positionStyle.marginLeft = 0;
  }

  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={!maxWidth || disableGutters}
      sx={{ ...positionStyle, ...containerStyle }}
    >
      <Paper elevation={elevation} variant={variant} sx={sx} component={component} onSubmit={onSubmit}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {supertitle}

            <Typography
              variant={titleVariant}
              sx={[
                titleStyles,
                truncateTitle
                  ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                  : undefined
              ]}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography color='GrayText' sx={{ mb: 3 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions && <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>{actions}</Box>}
        </Box>

        {children}
      </Paper>
    </Container>
  );
};

export default Section;
