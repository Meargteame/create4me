import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  amount?: number;
  stagger?: number;
}

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export const AnimatedText = ({
  text,
  el: Wrapper = 'p',
  className,
  once,
  amount = 0.5,
  stagger = 0.05,
}: AnimatedTextProps) => {
  const textArray = Array.isArray(text) ? text : [text];
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: i * 0 },
    }),
  };

  return (
    <Wrapper className={className}>
      <motion.span
        style={{ display: 'inline-block' }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
      >
        {textArray.map((line, i) => (
          <span style={{ display: 'block' }} key={i}>
            {line.split(' ').map((word: string, j: number) => (
              <span style={{ display: 'inline-block', overflow: 'hidden' }} key={j}>
                <motion.span
                  style={{ display: 'inline-block', willChange: 'transform' }}
                  variants={defaultAnimations}
                >
                  {word + (j !== line.split(' ').length - 1 ? '\u00A0' : '')}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
