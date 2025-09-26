"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Sprout,
  MapPin,
  Languages,
  TrendingUp,
  Smartphone,
  AlertTriangle,
  Leaf,
  Sun,
  Droplets,
} from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function HomePage() {
  const [showFirebaseWarning, setShowFirebaseWarning] = useState(false)
  const [language, setLanguage] = useState<"en" | "hi" | "od">("en")

  useEffect(() => {
    const hasFirebaseConfig = !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    )

    setShowFirebaseWarning(!hasFirebaseConfig)
  }, [])

  const content = {
    en: {
      title: "AI-Powered Crop Yield Prediction for Farmers",
      subtitle:
        "Make smarter farming decisions with machine learning. Predict crop yields, optimize resources, and maximize your harvest using local weather and soil data.",
      predictYield: "Predict Yield",
      signIn: "Sign In",
      accurateTitle: "Accurate Predictions",
      accurateDesc:
        "Advanced AI models trained on agricultural data provide reliable yield forecasts for rice, wheat, and other local crops.",
      locationTitle: "Location-Based",
      locationDesc:
        "Get predictions tailored to your specific district and soil conditions across India's diverse agricultural zones.",
      bilingualTitle: "Multilingual Support",
      bilingualDesc:
        "Use the app in English, Hindi, or Tamil language for better accessibility and understanding by local farmers.",
      trustedTitle: "Trusted by Farmers Across India",
      trustedDesc:
        "Join thousands of farmers who are already using AI to make better farming decisions and increase their crop yields.",
    },
    hi: {
      title: "किसानों के लिए AI-संचालित फसल उपज पूर्वानुमान",
      subtitle:
        "मशीन लर्निंग की मदद से खेती के बेहतर फ़ैसले लें। स्थानीय मौसम और मिट्टी के आंकड़ों का इस्तेमाल करके फ़सल की पैदावार का अनुमान लगाएँ, संसाधनों का बेहतर इस्तेमाल करें और अपनी फ़सल को अधिकतम बनाएँ।",
      predictYield: "उत्पादन पूर्वानुमान",
      signIn: "साइन इन",
      accurateTitle: "सटीक पूर्वानुमान",
      accurateDesc:
        "कृषि डेटा पर प्रशिक्षित उन्नत एआई मॉडल चावल, गेहूं और अन्य स्थानीय फसलों के लिए विश्वसनीय उपज पूर्वानुमान प्रदान करते हैं।",
      locationTitle: "स्थान-आधारित",
      locationDesc:
        "भारत के विविध कृषि क्षेत्रों में अपने विशिष्ट जिले और मिट्टी की स्थिति के अनुरूप पूर्वानुमान प्राप्त करें।",
      bilingualTitle: "बहुभाषी सहायता",
      bilingualDesc:
        "स्थानीय किसानों की बेहतर पहुंच और समझ के लिए ऐप का उपयोग अंग्रेजी, हिंदी या तमिल भाषा में करें।",
      trustedTitle: "भारत भर के किसानों द्वारा विश्वसनीय",
      trustedDesc:
        "उन हजारों किसानों में शामिल हों जो पहले से ही बेहतर कृषि निर्णय लेने और अपनी फसल की पैदावार बढ़ाने के लिए एआई का उपयोग कर रहे हैं।",
    },
    od: {
      title: "விவசாயிகளுக்கான AI-இயக்கப்படும் பயிர் மகசூல் கணிப்பு",
      subtitle:
        "இயந்திர கற்றல் மூலம் சிறந்த விவசாய முடிவுகளை எடுங்கள். உள்ளூர் வானிலை மற்றும் மண் தரவைப் பயன்படுத்தி பயிர் விளைச்சலைக் கணிக்கவும், வளங்களை மேம்படுத்தவும், உங்கள் அறுவடையை அதிகரிக்கவும்.",
      predictYield: "விளைச்சலைக் கணிக்கவும்",
      signIn: "உள்நுழையவும்",
      accurateTitle: "துல்லியமான கணிப்புகள்",
      accurateDesc:
        "விவசாயத் தரவுகளில் பயிற்சி பெற்ற மேம்பட்ட AI மாதிரிகள் அரிசி, கோதுமை மற்றும் பிற உள்ளூர் பயிர்களுக்கு நம்பகமான மகசூல் முன்னறிவிப்புகளை வழங்குகின்றன.",
      locationTitle: "இருப்பிடம் சார்ந்தது",
      locationDesc:
        "இந்தியாவின் பல்வேறு விவசாய மண்டலங்களில் உங்கள் குறிப்பிட்ட மாவட்டம் மற்றும் மண் நிலைமைகளுக்கு ஏற்ப கணிப்புகளைப் பெறுங்கள்.",
      bilingualTitle: "பன்மொழி ஆதரவு",
      bilingualDesc:
        "உள்ளூர் விவசாயிகளால் சிறந்த அணுகல் மற்றும் புரிதலுக்காக ஆங்கிலம், இந்தி அல்லது தமிழ் மொழிகளில் பயன்பாட்டைப் பயன்படுத்தவும்.",
      trustedTitle: "இந்தியா முழுவதும் உள்ள விவசாயிகளால் நம்பப்படுகிறது",
      trustedDesc:
        "சிறந்த விவசாய முடிவுகளை எடுக்கவும், பயிர் விளைச்சலை அதிகரிக்கவும் ஏற்கனவே AI ஐப் பயன்படுத்தும் ஆயிரக்கணக்கான விவசாயிகளுடன் இணையுங்கள்.",
    },
  }

  const currentContent = content[language]

  const getNextLanguage = () => {
    if (language === "en") return "hi"
    if (language === "hi") return "od"
    return "en"
  }

  const getLanguageLabel = () => {
    if (language === "en") return "हिन्दी"
    if (language === "hi") return "தமிழ்"
    return "English"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-100 to-green-200">
      {showFirebaseWarning && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-4 py-3">
            <Alert className="border-red-200 bg-transparent">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                <strong>Firebase Configuration Required:</strong> Please set up
                your Firebase environment variables in Project Settings to
                enable authentication and database features.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-green-300 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white-600 to-white-400 rounded-xl flex items-center justify-center shadow-lg">
              <img
                  src="/Gemini_Generated_Image_m87zpom87zpom87z-removebg-preview.png"
                  alt="Farmer using AI technology"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
            </div>
            <div>
              <span className="text-2xl font-bold text-green-800">
                AgriForecast
              </span>
              <p className="text-xs text-green-600">வேளாண் முன்னறிவிப்பு / कृषि पूर्वानुमान</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(getNextLanguage())}
              className="flex items-center gap-2 bg-white hover:bg-green-100 border-green-400"
            >
              <Languages className="w-4 h-4 text-green-600" />
              {getLanguageLabel()}
            </Button>

            <Link href="/login">
              <Button
                variant="ghost"
                disabled={showFirebaseWarning}
                className="hover:bg-green-100"
              >
                {currentContent.signIn}
              </Button>
            </Link>
            <Link href="/register">
              <Button
                disabled={showFirebaseWarning}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md"
              >
                {currentContent.predictYield}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
                {currentContent.title}
              </h1>
              <p className="text-lg text-green-700 mb-8 leading-relaxed">
                {currentContent.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {currentContent.predictYield}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 bg-white hover:bg-green-100 border-2 border-green-500"
                  >
                    {currentContent.signIn}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-200 to-green-100 rounded-3xl p-6 shadow-2xl">
                <img
                  src="/indian-farmer-in-odisha-using-smartphone-in-rice-f.jpg"
                  alt="Farmer using AI technology"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4 bg-yellow-300 text-yellow-800 p-3 rounded-full shadow-lg"
                >
                  <Smartphone className="w-6 h-6" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -bottom-4 -left-4 bg-green-600 text-white p-3 rounded-full shadow-lg"
                >
                  <Leaf className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[ 
              {
                icon: <TrendingUp className="w-10 h-10 text-white" />,
                bg: "from-green-600 to-green-400",
                title: currentContent.accurateTitle,
                desc: currentContent.accurateDesc,
              },
              {
                icon: <MapPin className="w-10 h-10 text-white" />,
                bg: "from-yellow-500 to-yellow-400",
                title: currentContent.locationTitle,
                desc: currentContent.locationDesc,
              },
              {
                icon: <Languages className="w-10 h-10 text-white" />,
                bg: "from-blue-500 to-blue-400",
                title: currentContent.bilingualTitle,
                desc: currentContent.bilingualDesc,
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-green-200"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md`}
                >
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">
                  {f.title}
                </h3>
                <p className="text-green-700 text-center leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trusted Section */}
        <section className="py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl p-12 border border-green-200 shadow-lg"
          >
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-green-700">
                <Sun className="w-6 h-6" />
                <span className="font-medium">Weather Data</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Droplets className="w-6 h-6" />
                <span className="font-medium">Soil Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Leaf className="w-6 h-6" />
                <span className="font-medium">Crop Health</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              {currentContent.trustedTitle}
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              {currentContent.trustedDesc}
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
