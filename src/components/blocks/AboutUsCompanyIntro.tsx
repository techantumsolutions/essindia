'use client';

import { motion } from 'framer-motion';
import {
  MotionSection,
  StaggerContainer,
} from '@/components/animations/MotionSection';
import {
  CheckCircle2,
  Layers,
  Zap,
  Globe,
} from 'lucide-react';

interface HighlightItem {
  title?: string;
  description?: string;
  icon?: string;
}

interface AboutUsCompanyIntroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  description2?: string;
  image?: string;
  items?: HighlightItem[];
}

interface AboutUsCompanyIntroProps {
  content?: AboutUsCompanyIntroContent;
}

const defaultHighlights: HighlightItem[] = [
  {
    title: 'Integrated Enterprise Solutions',
    description:
      'We deliver connected ERP ecosystems that unify finance, HR, sales, inventory, manufacturing, and core business operations.',
    icon: 'layers',
  },
  {
    title: 'Industry-Focused Expertise',
    description:
      'Our solutions are designed to support businesses across multiple industries with scalable and adaptable technologies.',
    icon: 'zap',
  },
  {
    title: 'Innovation & Digital Transformation',
    description:
      'From Business Intelligence to Automation and Mobile Apps, we help organizations modernize processes and improve productivity.',
    icon: 'globe',
  },
];

export function AboutUsCompanyIntro({
  content,
}: AboutUsCompanyIntroProps) {
  const title =
    content?.title || 'Eastern Software Solutions';

  const subtitle =
    content?.subtitle || 'Who We Are';

  const description =
    content?.description ||
    'Eastern Software Solutions is an enterprise software company with over three decades of experience helping businesses build scalable and future-ready digital foundations. We specialize in ERP solutions that streamline operations, improve visibility, and support business growth across industries.';

  const description2 =
    content?.description2 ||
    'Over the years, ESS has successfully delivered integrated enterprise solutions including ERP, Business Intelligence, RPA, and mobile applications that help organizations simplify workflows, improve decision-making, and drive operational efficiency.';

  const image =
    content?.image || '/about-us/who-we-are.png';

  const highlights =
    content?.items || defaultHighlights;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'layers':
        return <Layers className="w-5 h-5 text-orange-500" />;

      case 'zap':
        return <Zap className="w-5 h-5 text-emerald-500" />;

      case 'globe':
        return <Globe className="w-5 h-5 text-amber-500" />;

      default:
        return (
          <CheckCircle2 className="w-5 h-5 text-orange-500" />
        );
    }
  };

  const getCardStyles = (index: number) => {
    switch (index) {
      case 0:
        return {
          border: 'border-orange-200',
          bg: 'bg-orange-50',
        };

      case 1:
        return {
          border: 'border-emerald-200',
          bg: 'bg-emerald-50',
        };

      default:
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50',
        };
    }
  };

  return (
    <section className="py-8 md:py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* LEFT CONTENT */}
          <div>

            <MotionSection variant="fadeUp">

              <h3 className="text-3xl lg:text-5xl font-bold text-black leading-tight">
                {subtitle}
              </h3>
              <h2 className="text-3xl lg:text-5xl font-bold text-black leading-tight">
                {title}
              </h2>

              <div className="space-y-2">
                <p className="text-[#71717A] text-base">
                  {description}
                </p>

                <p className="text-[#71717A] text-base">
                  {description2}
                </p>
              </div>

            </MotionSection>

            <StaggerContainer className="space-y-2 mt-4">

              {highlights.map((item, index) => {
                const styles = getCardStyles(index);

                return (
                  <motion.div
                    key={index}
                    variants={{
                      initial: {
                        opacity: 0,
                        y: 20,
                      },
                      animate: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                        },
                      },
                    }}
                    className={`
                      rounded-2xl
                      border
                      ${styles.border}
                      bg-white
                      px-6
                      py-4
                      transition-all
                      duration-300
                      hover:shadow-lg
                    `}
                  >
                    <div className="flex items-center gap-4">

                      <div
                        className={`
                          w-12
                          h-12
                          rounded-full
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                          ${styles.bg}
                        `}
                      >
                        {renderIcon(item.icon)}
                      </div>

                      <div>
                        <h3 className="text-md font-semibold text-[#71717A]">
                          {item.title}
                        </h3>

                        <p className="text-[#71717A] text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                );
              })}

            </StaggerContainer>

          </div>

          {/* RIGHT IMAGE */}
          <MotionSection
            variant="scaleIn"
            className="flex justify-center lg:justify-end"
          >
            <div
              className="
                w-full
                max-w-[720px]
                rounded-[32px]
                border
                border-[#F1DCC3]
                bg-white
                p-4
                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
              "
            >
              <motion.img
                whileHover={{
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.5,
                }}
                src={image}
                alt={title}
                className="
                  w-full
                  md:h-[700px]
                  h-[400px]
                  object-cover
                  rounded-[24px]
                  shadow-2xl
                "
              />
            </div>
          </MotionSection>

        </div>
      </div>
    </section>
  );
}