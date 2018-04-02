import React from 'react';
import G2 from 'g2';
import createG2 from 'g2-react';

class BarChart extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'item1', count: 2},
        {name: 'item2', count: 22},
        {name: 'item3', count: 3},
        {name: 'item4', count: 6},
        {name: 'item5', count: 19},
        {name: 'item6', count: 6},
        {name: 'item7', count: 7},
        {name: 'item8', count: 10},
      ],
      forceFit: true,
      width: '100%',
      height: 350,
      plotCfg: {
        margin: [20, 60, 80, 120]
      },
    }
    this.doChart = this.doChart.bind(this);
  }
  doChart = () => {
    console.log('tttt');
    const data = this.props.data;
    const Chart = createG2(chart => {
      const Stat = G2.Stat;
      chart.setMode('select'); // 开启框选模式
      chart.select('rangeX'); // 设置 X 轴范围的框选
      chart.col('..count', {
        alias: 'top2000 唱片总量'
      });
      chart.col('release', {
        tickInterval: 5,
        alias: '唱片发行年份'
      });
      chart.interval().position('name*count').color('#4c7cd4');
      chart.render();
      // 监听双击事件，这里用于复原图表
      chart.on('plotdblclick', function(ev) {
        chart.get('options').filters = {}; // 清空 filters
        chart.repaint();
      });
    });
    return (
      <div>
        <Chart
          data={this.props.data}
          width={this.state.width}
          height={this.state.height}
          plotCfg={this.state.plotCfg}
          forceFit={this.state.forceFit}
        />
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.doChart()}
      </div>
    );
  }
}
export default BarChart;