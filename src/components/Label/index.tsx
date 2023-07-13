import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

interface LabelProps {
  className?: string;
  color?:
    | 'primary'
    | 'black'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'info';
  children?: ReactNode;
}

const LabelWrapper = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: `${theme.spacing(0.5, 1)}`,
  fontSize: theme.typography.pxToRem(13),
  borderRadius: theme.shape.borderRadius,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxHeight: theme.spacing(3),

  '&.MuiLabel': {
    '&-primary': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&-black': {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    '&-secondary': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.main,
    },
    '&-success': {
      backgroundColor: theme.palette.success.light,
      color: theme.palette.success.main,
    },
    '&-warning': {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.warning.main,
    },
    '&-error': {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.main,
    },
    '&-info': {
      backgroundColor: theme.palette.info.light,
      color: theme.palette.info.main,
    },
  },
}));

const Label: FC<LabelProps> = ({
  className,
  color = 'secondary',
  children,
  ...rest
}) => {
  return (
    <LabelWrapper className={'MuiLabel-' + color} {...rest}>
      {children}
    </LabelWrapper>
  );
};

Label.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'black',
    'secondary',
    'error',
    'warning',
    'success',
    'info',
  ]),
};

export default Label;
