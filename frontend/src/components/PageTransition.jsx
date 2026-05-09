import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import './styles/page-transitions.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={250}
        unmountOnExit
      >
        <div>{children}</div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default PageTransition;
