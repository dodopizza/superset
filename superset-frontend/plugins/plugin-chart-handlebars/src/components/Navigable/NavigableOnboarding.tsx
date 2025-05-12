// DODO created 49751291
import { FC, useState } from 'react';
import { addAlpha, styled, t } from '@superset-ui/core';
import { Button } from 'antd';

const NAVIGABLE_ONBOARDING_SEEN_KEY = 'dodo_navigable_onboarding_seen';

// Overlay that dims the background and centers content
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) =>
    addAlpha(theme.colors.grayscale.dark2, 0.4)};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 24px;
`;

// Main modal card
const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.grayscale.base};
  border-radius: 12px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 8px 24px
    ${({ theme }) => addAlpha(theme.colors.grayscale.dark2, 0.3)};
  color: ${({ theme }) => theme.colors.grayscale.light5};
  max-height: 100%;
  overflow: auto;
`;

// Header section
const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid
    ${({ theme }) => addAlpha(theme.colors.grayscale.light5, 0.1)};
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.grayscale.light2};
`;

// List of features
const FeaturesList = styled.div`
  padding: 20px 24px;
`;

const FeatureItem = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
`;

// Shortcut UI
const Shortcut = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin: 2px;
  background: ${({ theme }) => theme.colors.grayscale.light1};
  color: ${({ theme }) => theme.colors.grayscale.dark2};
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
`;

// Action buttons
const Actions = styled.div`
  padding: 16px 24px;
  text-align: right;
  border-top: 1px solid
    ${({ theme }) => addAlpha(theme.colors.grayscale.light5, 0.1)};
`;

// Utility functions for localStorage
const hasSeenOnboarding = (): boolean => {
  try {
    return localStorage.getItem(NAVIGABLE_ONBOARDING_SEEN_KEY) === 'true';
  } catch (e) {
    console.warn('localStorage not available');
    return false;
  }
};

const markOnboardingAsSeen = (): void => {
  try {
    localStorage.setItem(NAVIGABLE_ONBOARDING_SEEN_KEY, 'true');
  } catch (e) {
    console.warn('Could not save onboarding state to localStorage');
  }
};

// Platform detection
const isMacPlatform = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
const ctrlKeyLabel = isMacPlatform ? '⌘ Command' : 'Ctrl';

interface NavigableOnboardingProps {
  onClose?: () => void;
}

const NavigableOnboarding: FC<NavigableOnboardingProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(!hasSeenOnboarding());

  const handleDismiss = () => {
    markOnboardingAsSeen();
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <Overlay>
      <Modal aria-labelledby="onboarding-title" role="dialog" aria-modal="true">
        <Header>
          <Title id="onboarding-title">{t('Chart Navigation Features')}</Title>
          <Description>
            {t('This chart supports interactive navigation:')}
          </Description>
        </Header>

        <FeaturesList>
          <FeatureItem>
            <strong>{t('Pan the chart:')}</strong> {t('Hold')}{' '}
            <Shortcut>{ctrlKeyLabel}</Shortcut>{' '}
            {t('while dragging with the mouse')}
          </FeatureItem>

          <FeatureItem>
            <strong>{t('Zoom in/out:')}</strong> {t('Hold')}{' '}
            <Shortcut>{ctrlKeyLabel}</Shortcut>{' '}
            {t('while scrolling the mouse wheel, or use')}{' '}
            <Shortcut>+</Shortcut> {t('and')} <Shortcut>-</Shortcut> {t('keys')}
          </FeatureItem>

          <FeatureItem>
            <strong>{t('Reset view:')}</strong> {t('Press')}{' '}
            <Shortcut>Esc</Shortcut> {t('or click the Reset button')}
          </FeatureItem>
        </FeaturesList>

        <Actions>
          <Button type="primary" onClick={handleDismiss}>
            {t('Got it!')}
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default NavigableOnboarding;
