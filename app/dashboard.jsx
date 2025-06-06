import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

export default function DashboardUmidade() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
  axios.get("https://back-end-pi-27ls.onrender.com/api/sensor/stats")
    .then((response) => {
      const data = response.data;
      const distribuicao = data.latest_data.map((item) => ({
        date: new Date(item.timestamp),
        valor: item.humidity
      }));

      // Agrupando por mês
      const mensal = {};
      distribuicao.forEach((d) => {
        const mes = d.date.toLocaleString('pt-BR', { month: 'short' });
        if (!mensal[mes]) mensal[mes] = { total: 0, count: 0 };
        mensal[mes].total += d.valor;
        mensal[mes].count += 1;
      });

      const mesesOrdenados = Object.keys(mensal).slice(-6); // últimos 6 meses
      const mediaMensal = {};
      mesesOrdenados.forEach((mes) => {
        mediaMensal[mes] = mensal[mes].total / mensal[mes].count;
      });

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
        mediaMensal,
        mesesOrdenados
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados do dashboard:", error);
    });
}, []);

function getStatusInfo(humidity) {
  if (humidity < 30) {
    return { status: "Crítico", color: "#e74c3c" };
  } else if (humidity < 50) {
    return { status: "Baixo", color: "#f39c12" };
  } else if (humidity < 70) {
    return { status: "Médio", color: "#f1c40f" };
  } else if (humidity <= 100) {
    return { status: "Bom", color: "#2ecc71" };
  } else {
    return { status: "Sobrecarregado", color: "#9b59b6" };
  }
}

  const pieData = [
    { name: 'Crítico', population: stats?.distribuicao?.critico || 0, color: '#e74c3c', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Baixo', population: stats?.distribuicao?.baixo || 0, color: '#f39c12', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Médio', population: stats?.distribuicao?.medio || 0, color: '#f1c40f', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Bom', population: stats?.distribuicao?.bom || 0, color: '#2ecc71', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Sobrecarregado', population: stats?.distribuicao?.sobrecarregado || 0, color: '#9b59b6', legendFontColor: '#333', legendFontSize: 12 }
  ];

  const barData = {
    labels: stats?.mesesOrdenados || [],
    datasets: [
      {
        data: stats?.mesesOrdenados?.map(mes => parseFloat(stats.mediaMensal[mes].toFixed(2))) || [],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // verde
      }
    ]
  };

const status = {
  mesesOrdenados: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  mediaMensal: {
    Jan: 65.23,
    Fev: 70.75,
    Mar: 68.4,
    Abr: 74.1,
    Mai: 69.5,
    Jun: 72.0
  }
};


  const safeValue = val => (typeof val === 'number' && isFinite(val) ? val : 0);

const lineData = {
  labels: status?.mesesOrdenados || [],
  datasets: [
    {
      data: status?.mesesOrdenados?.map(mes =>
        parseFloat(safeValue(status?.mediaMensal?.[mes]).toFixed(2))
      ) || [],
      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // azul
      strokeWidth: 2
    }
  ],
  legend: ['Umidade (%)']
};
//const safeValue = val => (typeof val === 'number' && isFinite(val) ? val : 0);
//const lineData = {
//  labels: stats?.mesesOrdenados || [],
//  datasets: [
//    {
//      data: stats?.mesesOrdenados?.map(mes =>
//        parseFloat(safeValue(stats?.mediaMensal?.[mes]).toFixed(2))
//      ) || [],
//      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
//      strokeWidth: 2
//    }
//  ],
//  legend: ['Umidade (%)']
//};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Monitoramento</Text>

      {stats && (
      <View style={[styles.cardDynamic, { backgroundColor: getStatusInfo(stats.statusAtual).color }]}>
        <Text style={styles.cardTitle}>Status Atual de Umidade</Text>
        <Text style={styles.percent}>{stats.statusAtual.toFixed(2)}%</Text>
        <Text style={styles.goodText}>{getStatusInfo(stats.statusAtual).status}</Text>
      </View>
      )}

      <View style={styles.statsHorizontal}>
        <Text style={styles.statsText}>Média: {stats?.media?.toFixed(2) || '---'}%</Text>
        <Text style={styles.statsText}>Mediana: {stats?.mediana?.toFixed(2) || '---'}%</Text>
        <Text style={styles.statsText}>Moda: {stats?.moda?.toFixed(2) || '---'}%</Text>
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.goodText}>Assimetria: {stats?.assimetria || 0}</Text>
        <Text style={styles.goodText}>Curtose: {stats?.curtose || 0}</Text>
      </View>
      <View style={styles.statsBox}>
        <Text style={styles.goodText}>Desvio Padrão: {stats?.desvioPadrao || 0}</Text>
        <Text style={styles.goodText}>Previsão Amanhã: {stats?.previsaoAmanha || 0}</Text>
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
        verticalLabelRotation={30}
        fromZero={true}
        showValuesOnTopOfBars={true}
      />

      <Text style={styles.chartTitle}>Tendência de Umidade (Linha)</Text>
      <LineChart
        data={lineData}
        width={screenWidth - 20}
        height={250}
        chartConfig={chartConfig}
        bezier // ⚠️ Isso é essencial para suavizar a curva
        style={{
          borderRadius: 10,
          marginVertical: 10
        }}
/>

    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  fillShadowGradient: '#007bff', // cor da barra (azul)
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // cor dos textos (preto)
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5, // largura das barras (ajustável entre 0 e 1)
  propsForLabels: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  propsForBackgroundLines: {
    stroke: '#e3e3e3'
  },
  decimalPlaces: 0
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
    backgroundColor: '#052338',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    marginBottom: 20
  },
  chartTitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cardDynamic: {
  borderRadius: 10,
  padding: 15,
  alignItems: 'center',
  marginBottom: 20
  }
});