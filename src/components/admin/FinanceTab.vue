<template>
  <div class="space-y-6">
    <!-- Revenue Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-sm font-medium text-gray-600">Revenus cette semaine</h3>
        <p class="text-2xl font-bold mt-2">{{ formatCurrency(adminStore.getRevenueByPeriod('week')) }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-sm font-medium text-gray-600">Revenus ce mois</h3>
        <p class="text-2xl font-bold mt-2">{{ formatCurrency(adminStore.getRevenueByPeriod('month')) }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-sm font-medium text-gray-600">Revenus cette année</h3>
        <p class="text-2xl font-bold mt-2">{{ formatCurrency(adminStore.getRevenueByPeriod('year')) }}</p>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold">Dernières transactions</h3>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateur
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in adminStore.transactions.slice(0, 20)" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(transaction.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              User #{{ transaction.userId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  transaction.type === 'token' ? 'bg-blue-100 text-blue-800' :
                  transaction.type === 'subscription' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800',
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                ]"
              >
                {{ getTransactionTypeLabel(transaction.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transaction.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {{ transaction.amount > 0 ? formatCurrency(transaction.amount) : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getTransactionTypeLabel = (type) => {
  const labels = {
    'token': 'Achat tokens',
    'subscription': 'Abonnement',
    'token_used': 'Utilisation'
  }
  return labels[type] || type
}
</script> 