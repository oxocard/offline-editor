import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

/* Components */
import SvgButton from '../SvgButton';
import DeviceMenu from './DeviceMenu';
import UserScriptsMenu from './UserScripsMenu';
import ConstantsMenu from './ConstantsMenu';
import VariablesMenu from './VariablesMenu';
import TerminalMenu from './TerminalMenu';

/* Store */
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectMenu, toggleMenu } from '../../store/slices/layout';

/* Interfaces */
interface MenuContainerProps {
  $isOpen: boolean;
}

/* Styles */
const MenuContainer = styled.div<MenuContainerProps>`
  background-color: ${({ theme }) => theme.colors.contentBackground};
  position: absolute;
  min-width: ${({ $isOpen }) => ($isOpen ? '42rem' : '6rem')};
  width: ${({ $isOpen }) => ($isOpen ? '24vw' : '6rem')};

  right: 0px;
  height: 100%;
  z-index: 12;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media only screen and (max-width: 1024px) {
    box-shadow: -5px 0px 4px 0px rgba(0, 0, 0, 0.25);
  }
`;

const MenuContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const MenuNavigation = styled.div`
  height: 6rem;
  min-height: 6rem;
  background-color: ${({ theme }) => theme.colors.toolsHeaderBackground};

  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2.2rem;
    font-weight: 500;
    overflow: hidden;
  }
`;

const MenuSpace = styled.div`
  flex: 1;
`;

function Menu() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isMenuOpen = useAppSelector((state) => state.layout.isMenuOpen);
  const selectedMenu = useAppSelector((state) => state.layout.selectedMenu);

  return (
    <MenuContainer $isOpen={isMenuOpen}>
      <MenuNavigation>
        <SvgButton
          id="btn_toggle_menu"
          altText="Toggle Menu"
          onClick={() => dispatch(toggleMenu())}
        >
          {isMenuOpen && (
            <svg className="svg_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
              <path d="M24.101,21.152C23.54,20.59 23.54,19.748 24.101,19.186C24.663,18.624 25.506,18.624 26.068,19.186L35.899,29.017C36.46,29.579 36.46,30.421 35.899,30.983L26.068,40.814C25.506,41.376 24.663,41.376 24.101,40.814C23.54,40.252 23.54,39.41 24.101,38.848L32.949,30L24.101,21.152Z" />
            </svg>
          )}
          {!isMenuOpen && (
            <svg className="svg_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
              <path d="M35.899,21.152C36.46,20.59 36.46,19.748 35.899,19.186C35.337,18.624 34.494,18.624 33.932,19.186L24.101,29.017C23.54,29.579 23.54,30.421 24.101,30.983L33.932,40.814C34.494,41.376 35.337,41.376 35.899,40.814C36.46,40.252 36.46,39.41 35.899,38.848L27.051,30L35.899,21.152Z" />
            </svg>
          )}
        </SvgButton>
        {isMenuOpen && (
          <>
            <MenuSpace />

            <SvgButton
              id="btn_devices"
              altText="Devices"
              active={selectedMenu === 0}
              onClick={() => dispatch(selectMenu(0))}
            >
              <svg
                className="svg_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_nav_devices')}
              >
                <path d="M28.5,24v3h3V24Zm4-2a1,1,0,0,1,1,1v5a1,1,0,0,1-1,1h-5a1,1,0,0,1-1-1V23a1,1,0,0,1,1-1ZM30,35a1,1,0,1,0-1-1A1,1,0,0,0,30,35Zm0,2a3,3,0,1,1,3-3A3,3,0,0,1,30,37ZM24.5,22V38h11V22Zm11-2a2,2,0,0,1,2,2V38a2,2,0,0,1-2,2h-11a2,2,0,0,1-2-2V22a2,2,0,0,1,2-2Z" />
              </svg>
            </SvgButton>

            <SvgButton
              id="btn_user_scripts"
              altText="User scripts"
              active={selectedMenu === 1}
              onClick={() => dispatch(selectMenu(1))}
            >
              <svg
                className="svg_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_nav_user_code')}
              >
                <path d="M24,30a.68.68,0,0,0-.49.31l-3,6.69H36.32a.7.7,0,0,0,.49-.31l3-6.69Zm-2.32-.5A2.67,2.67,0,0,1,24,28H36V26H29a2,2,0,0,1-1.67-.91L26,23H20V33.28ZM40.32,28a1.6,1.6,0,0,1,1.51,2.32L38.64,37.5A2.68,2.68,0,0,1,36.32,39H20a1.88,1.88,0,0,1-.49-.06A2,2,0,0,1,18,37V23a2,2,0,0,1,2-2h6.05a2.08,2.08,0,0,1,1.55.83L29,24h7a2,2,0,0,1,2,2v2Z" />
              </svg>
            </SvgButton>

            <SvgButton
              id="btn_constants"
              altText="Constants"
              active={selectedMenu === 2}
              onClick={() => dispatch(selectMenu(2))}
            >
              <svg
                className="svg_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_nav_constants')}
              >
                <path d="M22,38H38V22H22Zm0,2a2,2,0,0,1-2-2V22a2,2,0,0,1,2-2H38a2,2,0,0,1,2,2V38a2,2,0,0,1-2,2Zm4-7.5V32a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1v.5h6a1,1,0,0,1,0,2H29V35a1,1,0,0,1-1,1H27a1,1,0,0,1-1-1v-.5H25a1,1,0,0,1,0-2ZM31,25a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1v.5h1a1,1,0,0,1,0,2H34V28a1,1,0,0,1-1,1H32a1,1,0,0,1-1-1v-.5H25a1,1,0,0,1,0-2h6Z" />
              </svg>
            </SvgButton>

            <SvgButton
              id="btn_variables"
              altText="Variables"
              active={selectedMenu === 3}
              onClick={() => dispatch(selectMenu(3))}
            >
              <svg
                className="svg_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_nav_variables')}
              >
                <path
                  d="M30.1,36.6c-4.3,0.1-8.3-2.3-10.3-6.1L19.5,30l0.2-0.5c3.1-5.7,10.2-7.8,15.9-4.7c2,1.1,3.6,2.7,4.7,4.7
		c0.3,0.5,0.1,1.1-0.4,1.3c-0.5,0.3-1.1,0.1-1.3-0.4c-2.6-4.7-8.5-6.4-13.2-3.9c-1.5,0.8-2.7,2-3.6,3.4c1.7,2.9,4.9,4.6,8.3,4.6
		c2.2,0,4.4-0.7,6.1-2.2c0.4-0.4,1.1-0.3,1.4,0.1c0.4,0.4,0.3,1.1-0.1,1.4C35.4,35.7,32.8,36.6,30.1,36.6z"
                />
                <path
                  d="M30,34c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S32.2,34,30,34L30,34z M30,28c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2
		C32,28.9,31.1,28,30,28z"
                />
              </svg>
            </SvgButton>

            <SvgButton
              id="btn_terminal"
              altText="Terminal"
              active={selectedMenu === 4}
              onClick={() => dispatch(selectMenu(4))}
            >
              <svg
                className="svg_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
                data-tooltip-id="main-tooltip"
                data-tooltip-content={t('menu_nav_terminal')}
              >
                <path d="M27.14,31.06a1,1,0,0,1-.71-.29l-6-6a1,1,0,1,1,1.42-1.42l6,6a1,1,0,0,1,0,1.42A1,1,0,0,1,27.14,31.06Z" />
                <path d="M21.1,37.1a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l6-6a1,1,0,0,1,1.42,1.42l-6,6A1,1,0,0,1,21.1,37.1Z" />
                <path d="M39.05,37.5H29a1,1,0,0,1,0-2h10a1,1,0,0,1,0,2Z" />
              </svg>
            </SvgButton>
          </>
        )}
      </MenuNavigation>
      {isMenuOpen && (
        <MenuContent>
          {selectedMenu === 0 && <DeviceMenu />}
          {selectedMenu === 1 && <UserScriptsMenu />}
          {selectedMenu === 2 && <ConstantsMenu />}
          {selectedMenu === 3 && <VariablesMenu />}
          {selectedMenu === 4 && <TerminalMenu />}
        </MenuContent>
      )}
    </MenuContainer>
  );
}

export default Menu;
