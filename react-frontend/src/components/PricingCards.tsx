import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false)
  
  const plans = [
    {
      name: "Starter",
      price: "5,000",
      currency: "ETB",
      period: "/month",
      description: "Perfect for small businesses and startups looking to try influencer marketing",
      features: [
        "Up to 5 creator collaborations/month",
        "Basic analytics dashboard", 
        "Email support",
        "Campaign templates",
        "Content approval workflow",
        "Payment processing"
      ],
      limitations: [
        "Limited to Instagram & Facebook",
        "Basic audience insights"
      ],
      popular: false,
      cta: "Start Free Trial",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional", 
      price: "15,000",
      currency: "ETB",
      period: "/month",
      description: "Ideal for growing brands ready to scale their influencer marketing efforts",
      features: [
        "Up to 20 creator collaborations/month",
        "Advanced analytics & reporting",
        "Priority support",
        "Custom campaign strategies",
        "Multi-platform campaigns",
        "A/B testing tools",
        "ROI tracking",
        "Dedicated account manager"
      ],
      limitations: [],
      popular: true,
      cta: "Get Started",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Enterprise",
      price: "Custom",
      currency: "",
      period: "",
      description: "For large brands and agencies needing full-scale influencer marketing solutions",
      features: [
        "Unlimited creator collaborations",
        "White-label platform options",
        "Custom integrations",
        "Advanced API access",
        "Dedicated success team",
        "Custom reporting",
        "Priority creator matching",
        "Contract management",
        "Multi-brand management"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  return (
    <section className="relative bg-gradient-to-b from-white to-slate-50 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative z-10"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-full text-emerald-900 text-sm font-bold mb-8 shadow-md"
          >
            <span className="text-lg">💰</span>
            Transparent Pricing
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Choose the{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Start free, scale as you grow. All plans include access to our verified Ethiopian creator network.
          </p>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 rounded-full p-1.5 shadow-lg"
          >
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-full border-none font-bold cursor-pointer transition-all ${
                !isAnnual 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-full border-none font-medium cursor-pointer transition-all ${
                isAnnual 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
            >
              Annual <span className="text-green-600">(Save 20%)</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-3 gap-6 lg:gap-8 mb-16 mt-8 relative z-10">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: plan.popular ? 1.05 : 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: plan.popular ? 1.08 : 1.03 }}
              className="group relative"
            >
              {/* Popular Badge - Outside card to prevent clipping */}
              {plan.popular && (
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className={`absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.gradient} text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-xl z-20`}
                >
                  ⭐ Most Popular
                </motion.div>
              )}

              <div className={`relative p-10 rounded-3xl backdrop-blur-xl border-2 shadow-2xl overflow-hidden transition-all duration-500 ${plan.popular ? 'bg-gradient-to-br from-purple-50/90 to-pink-50/90 border-purple-400/50 shadow-purple-500/30' : 'bg-white/70 border-gray-200/50'}`}>
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl" />
                
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${plan.gradient} transition-opacity duration-500 rounded-3xl`} />

                {/* Plan Header */}
                <div className="text-center mb-8 relative z-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-6">
                    <span className={`text-6xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                      {isAnnual && plan.price !== 'Custom' 
                        ? Math.round(parseFloat(plan.price.replace(/,/g, '')) * 12 * 0.8).toLocaleString()
                        : plan.price
                      }
                    </span>
                    {plan.currency && (
                      <span className="text-lg text-gray-600 ml-2">
                        {plan.currency}{isAnnual ? '/year' : plan.period}
                      </span>
                    )}
                    {isAnnual && plan.price !== 'Custom' && (
                      <div className="text-sm text-green-600 font-semibold mt-2">
                        Save {Math.round(parseFloat(plan.price.replace(/,/g, '')) * 12 * 0.2).toLocaleString()} ETB/year
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8 relative z-10">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">
                    What's included:
                  </h4>
                  
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start text-sm text-gray-700"
                      >
                        <span className={`bg-gradient-to-r ${plan.gradient} text-white w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 font-bold text-xs flex-shrink-0 shadow-md`}>✓</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200/50">
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start mb-2 text-xs text-gray-400">
                          <span className="text-amber-500 mr-2 mt-0.5">⚠</span>
                          {limitation}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative z-10 w-full px-6 py-4 rounded-full font-bold text-lg cursor-pointer transition-all shadow-lg hover:shadow-xl ${plan.popular ? `bg-gradient-to-r ${plan.gradient} text-white border-none` : 'bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-900 hover:border-purple-400'}`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom FAQ */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 relative z-10"
        >
          <p className="text-xl text-gray-600 mb-6">
            Questions about pricing? 
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-transparent text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text border-none text-xl font-bold cursor-pointer transition-all"
          >
            Contact our sales team →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}