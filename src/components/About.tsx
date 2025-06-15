import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code2, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Why NeetBTC Exists
          </h1>
          <p className="text-xl text-gray-300">
            Consolidating Bitcoin tools into one seamless experience
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Bitcoin users often need to juggle multiple websites to track mempool data,
            estimate fees, and stay updated with news. NeetBTC brings these essential
            tools together in one intuitive dashboard, saving time and improving the
            user experience.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Feature
              icon={<Globe className="h-6 w-6" />}
              title="Accessibility"
              description="Making Bitcoin data accessible to everyone through a clean, intuitive interface"
            />
            <Feature
              icon={<Code2 className="h-6 w-6" />}
              title="Open Source"
              description="Transparent development and community-driven improvements"
            />
            <Feature
              icon={<Github className="h-6 w-6" />}
              title="Community"
              description="Built by Bitcoiners, for Bitcoiners"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold mb-6">Open Source</h2>
          <p className="text-gray-300 mb-8">
            NeetBTC is proudly open source. We believe in transparency and community
            collaboration. Check out our GitHub repository to contribute or learn more.
          </p>
          <a
            href="https://github.com/yourusername/neetbtc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Github className="h-5 w-5 mr-2" />
            View on GitHub
          </a>
        </motion.section>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-700/30 rounded-xl p-6"
  >
    <div className="text-purple-400 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);