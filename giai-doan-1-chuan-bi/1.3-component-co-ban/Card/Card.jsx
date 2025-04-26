import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  header: {
    padding: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
    backgroundSize: 'cover',
  },
  content: {
    padding: theme.spacing(2),
  },
  actions: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  noHeader: {
    paddingTop: 0,
  },
  noActions: {
    paddingBottom: 0,
  },
}));

/**
 * Card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subheader - Card subheader
 * @param {React.ReactNode} props.avatar - Card avatar
 * @param {string} props.image - Card image URL
 * @param {string} props.imageAlt - Card image alt text
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Card actions
 * @param {boolean} props.raised - Whether card is raised
 * @param {function} props.onClick - Click handler
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Card component
 */
const Card = ({
  title,
  subheader,
  avatar,
  image,
  imageAlt = '',
  children,
  actions,
  raised = false,
  onClick,
  ...rest
}) => {
  const classes = useStyles();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <MuiCard
      className={classes.root}
      raised={raised}
      onClick={handleClick}
      {...rest}
    >
      {(title || subheader || avatar) && (
        <CardHeader
          className={classes.header}
          avatar={
            avatar || (
              title && (
                <Avatar aria-label={title} className={classes.avatar}>
                  {title.charAt(0)}
                </Avatar>
              )
            )
          }
          title={title}
          subheader={subheader}
        />
      )}

      {image && (
        <CardMedia className={classes.media} image={image} title={imageAlt} />
      )}

      <CardContent className={`${classes.content} ${!title && !subheader && !avatar ? classes.noHeader : ''}`}>
        {typeof children === 'string' ? (
          <Typography variant="body2" color="textSecondary" component="p">
            {children}
          </Typography>
        ) : (
          children
        )}
      </CardContent>

      {actions && (
        <CardActions className={classes.actions} disableSpacing>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;