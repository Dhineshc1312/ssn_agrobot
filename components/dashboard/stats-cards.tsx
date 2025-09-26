"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, BarChart3, TrendingUp, CalendarDays } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardsProps {
  totalFarms: number
  totalPredictions: number
  avgYield: number
  lastPrediction: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function StatsCards({ totalFarms, totalPredictions, avgYield, lastPrediction }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Farms Card */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="bg-green-100 border border-green-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Farms</CardTitle>
            <Leaf className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalFarms}</div>
            <p className="text-xs text-green-700">Active farm locations</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Predictions Made Card */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card className="bg-green-100 border border-green-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Predictions Made</CardTitle>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalPredictions}</div>
            <p className="text-xs text-green-700">Total yield predictions</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avg. Predicted Yield Card */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <Card className="bg-green-100 border border-green-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Avg. Predicted Yield</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{avgYield.toFixed(1)}</div>
            <p className="text-xs text-green-700">kg/hectare</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Last Prediction Card */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <Card className="bg-green-100 border border-green-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Last Prediction</CardTitle>
            <CalendarDays className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{lastPrediction}</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}