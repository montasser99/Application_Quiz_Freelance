import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "./Layout/Layout";

export default function Welcome() {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      background: "linear-gradient(135deg, #02545f 0%, #3ab8c9 100%)"
    },
    hover: {
      scale: 1.05,
      background: "linear-gradient(135deg, #3ab8c9 0%, #02545f 100%)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Layout>

      {/* Hero Section */}
      <header className="w-full bg-gradient-to-r from-[#46D3E5] to-[#3ab8c9] py-16 md:py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Test Your Knowledge <br />With <span className="text-[#02545f]">Wevioo Quiz</span>
            </h1>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto mb-10">
              Join thousands of players worldwide in our interactive quiz platform. Challenge yourself, learn new things, and climb the leaderboard!
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                {isHovered ? "Let's Begin! 🚀" : "Start Free Trial"}
              </motion.button>
              <button className="px-8 py-4 rounded-full bg-white text-[#46D3E5] font-bold text-lg hover:bg-gray-100 transition-colors">
                Explore Quizzes
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#FC5C15] opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose <span className="text-[#46D3E5]">Wevioo Quiz</span>?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform offers an unparalleled quiz experience with thousands of questions across diverse categories, real-time multiplayer modes, and detailed performance analytics.
              </p>
              <ul className="space-y-4">
                {[
                  "Daily challenge quizzes with special rewards",
                  "Compete with friends in real-time",
                  "Detailed statistics and progress tracking",
                  "New content added weekly"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 mt-1 mr-3">
                      <div className="w-6 h-6 rounded-full bg-[#46D3E5] flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              className="bg-gradient-to-br from-[#46D3E5] to-[#3ab8c9] rounded-3xl p-1 h-96"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl h-full w-full shadow-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Interactive Dashboard</h3>
                  <p className="text-gray-600">Track your progress and achievements</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <div className="text-center mb-20">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Amazing Features
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover what makes Wevioo Quiz the best choice for quiz enthusiasts
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "⚡", title: "Fast Paced", desc: "Quick quizzes for on-the-go learning" },
                { icon: "🌐", title: "Global", desc: "Compete with players worldwide" },
                { icon: "📈", title: "Progress", desc: "Track your improvement over time" },
                { icon: "🏆", title: "Rewards", desc: "Earn badges and achievements" },
                { icon: "👥", title: "Community", desc: "Join our vibrant quiz community" },
                { icon: "🔄", title: "Daily Updates", desc: "Fresh content every day" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

    </Layout>
  );
}