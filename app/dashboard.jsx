import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

export default function DashboardUmidade() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("https://back-end-pi-27ls.onrender.com/api/sensor/stats")
      .then((response) => {
        const data = response.data;

        const distribuicao = data.latest_data.map((item) => ({
          data: new Date(item.timestamp).toLocaleDateString('pt-BR', { month: 'short' }),
          valor: item.humidity
        }));

        setStats({
          media: data.mean,
          mediana: data.median,
          moda: data.mode,
          desvioPadrao: data.std_dev,
          assimetria: data.skewness,
          curtose: data.kurtosis,
          previsaoAmanha: data.trend?.tomorrow_prediction || 0,
          statusAmanha: data.trend?.predicted_classification || '',
          statusAtual: data.latest_data?.[0]?.humidity || 0,
          distribuicao: data.binomial_distribution || {},
          mediaMensal: {
            junho: distribuicao.filter(d => d.data.includes('jun')).reduce((sum, d) => sum + d.valor, 0) / distribuicao.filter(d => d.data.includes('jun')).length || 0,
            maio: distribuicao.filter(d => d.data.includes('mai')).reduce((sum, d) => sum + d.valor, 0) / distribuicao.filter(d => d.data.includes('mai')).length || 0,
          }
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do dashboard:", error);
      });
  }, []);

  const pieData = [
    { name: 'Crítico', population: stats?.distribuicao?.critico || 0, color: '#e74c3c', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Baixo', population: stats?.distribuicao?.baixo || 0, color: '#f39c12', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Médio', population: stats?.distribuicao?.medio || 0, color: '#f1c40f', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Bom', population: stats?.distribuicao?.bom || 0, color: '#2ecc71', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Sobrecarregado', population: stats?.distribuicao?.sobrecarregado || 0, color: '#9b59b6', legendFontColor: '#333', legendFontSize: 12 }
  ];

  const barData = {
    labels: ['jun.', 'mai.'],
    datasets: [
      {
        data: [stats?.mediaMensal?.junho || 0, stats?.mediaMensal?.maio || 0]
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Monitoramento</Text>

      <View style={styles.cardGreen}>
        <Text style={styles.cardTitle}>Status Atual de Umidade</Text>
        <Text style={styles.percent}>{stats?.statusAtual?.toFixed(2) || '---'}%</Text>
        <Text style={styles.goodText}>Bom</Text>
      </View>

      <View style={styles.statsHorizontal}>
        <Text style={styles.statsText}>Média: {stats?.media?.toFixed(2) || '---'}%</Text>
        <Text style={styles.statsText}>Mediana: {stats?.mediana?.toFixed(2) || '---'}%</Text>
        <Text style={styles.statsText}>Moda: {stats?.moda?.toFixed(2) || '---'}%</Text>
      </View>

      <View style={styles.statsBox}>
        <Text>Assimetria: {stats?.assimetria || 0}</Text>
        <Text>Curtose: {stats?.curtose || 0}</Text>
        <Text>Desvio Padrão: {stats?.desvioPadrao || 0}</Text>
        <Text>Previsão Amanhã: {stats?.previsaoAmanha || 0}</Text>
      </View>

      <Text style={styles.chartTitle}>Distribuição de Status do Solo</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />

      <Text style={styles.chartTitle}>Média Mensal de Umidade</Text>
      <BarChart
        data={barData}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
      />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForBackgroundLines: {
    strokeDasharray: '', // linhas contínuas
  },
  propsForLabels: {
    fontSize: 12,
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 10,
    backgroundColor: '#f5f6fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  cardGreen: {
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16
  },
  percent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff'
  },
  goodText: {
    color: '#fff'
  },
  statsHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  statsText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  statsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  chartTitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center'
  }
});