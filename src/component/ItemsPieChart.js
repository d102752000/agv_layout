import React from 'react';
import G2 from 'g2';
import createG2 from 'g2-react';

class ItemsPieChart extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'Microsoft Internet Explorer', value: 56.33 },
        {name: 'Chrome', value: 24.03},
        {name: 'Firefox', value: 10.38},
        {name: 'Safari',  value: 4.77},
        {name: 'Opera', value: 0.91},
        {name: 'Proprietary or Undetectable', value: 0.2}
      ],
      forceFit: true,
      width: 500,
      height: 450
    }
    this.doChart = this.doChart.bind(this);
  }
  doChart = () => {
    console.log('tttt');
    // const data = this.props.data;
    const Chart = createG2(chart => {
      var Stat = G2.Stat;
      // 重要：绘制饼图时，必须声明 theta 坐标系
      chart.coord('theta', {
        radius: 0.8 // 设置饼图的大小
      });
      // chart.legend('name', {
      //   position: 'bottom',
      //   itemWrap: true,
      //   formatter: function(val) {
      //     for(var i = 0, len = data.length; i < len; i++) {
      //       var obj = data[i];
      //       if (obj.name === val) {
      //         return val + ': ' + obj.value + '%';
      //       }
      //     }
      //   }
      // });
      chart.legend('name', {
          position: 'bottom',
          itemWrap: true});
      chart.tooltip({
        title: null,
        map: {
          value: 'value'
        }
      });
      chart.intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name')
        .label('name*..percent',function(name, percent){
          percent = (percent * 100).toFixed(2) + '%';
          return name + ' ' + percent;
        });
      chart.render();
      // 设置默认选中
      var geom = chart.getGeoms()[0]; // 获取所有的图形
      var items = geom.getData(); // 获取图形对应的数据
      geom.setSelected(items[1]); // 设置选中
    });
    return (
      <div>
        <Chart
          data={this.props.data}
          width={this.state.width}
          height={this.state.height}
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
export default ItemsPieChart;