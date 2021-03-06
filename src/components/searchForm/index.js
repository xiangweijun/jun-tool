/**
 * 表单搜索
 */
import React from 'react';
import PropTypes from 'prop-types';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Form, Button } from 'antd';
import ItemInput from './ItemInput';
import ItemRangeInput from './ItemRangeInput';
import ItemSelect from './ItemSelect';
import ItemSearch from './ItemSearch';
import ItemDate from './ItemDate';

function noop() {}

const components = {
  input: ItemInput, // 输入框
  rangeInput: ItemRangeInput, // 区间输入框
  select: ItemSelect, // 下拉框
  search: ItemSearch, // 搜索框
  date: ItemDate, // 时间范围选择器
};

class SearchForm extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    formRef: PropTypes.object,
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    list: PropTypes.array,
    multiple: PropTypes.bool,
    collapsed: PropTypes.bool,
    size: PropTypes.number,
    loading: PropTypes.bool,
    initialValues: PropTypes.object,
    onExport: PropTypes.func,
    extra: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    onCollapse: PropTypes.func,
    searchText: PropTypes.string,
    resetText: PropTypes.string,
    exportText: PropTypes.string,
    collapseText: PropTypes.string,
    uncollapseText: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    className: '',
    list: [], // 选择项
    multiple: false, // 是否为多功能搜索
    collapsed: true, // 高级搜索是否收起
    size: 3, // 简易搜索个数
    extra: null, // 搜索栏额外元素【操作按钮】
    onCollapse: noop,
    searchText: '查询', // 查询按钮文字
    resetText: '重置', // 重置按钮文字
    exportText: '导出', // 导出按钮文字
    collapseText: '展开', // 收起状态按钮文字
    uncollapseText: '收起', // 展开状态按钮文字
  };

  state = {
    collapsed: this.props.collapsed, // 高级搜索是否收起
  };

  // 高级/简易搜索切换
  onCollapse = () => {
    const { onCollapse } = this.props;
    this.setState((prevState) => ({
      collapsed: !prevState.collapsed,
    }), () => {
      onCollapse(this.state.collapsed);
    });
  };

  // 查询项渲染
  itemRender = (data = []) => {
    return data.map((item) => {
      const Component = components[item.type];
      if (item.render && typeof item.render === 'function') {
        return <React.Fragment key={item.name}>{item.render()}</React.Fragment>;
      }
      if (Component) {
        let key = item.name;
        if (item.type === 'rangeInput') {
          key = `${item.leftName}${item.rightName}`;
        }
        return <Component key={key} {...item} />;
      }
      return null;
    });
  };

  listRender = () => {
    const {
      list,
      multiple,
      size,
    } = this.props;
    if (multiple && this.state.collapsed) {
      return this.itemRender(list.slice(0, size));
    }
    return this.itemRender(list);
  };

  render() {
    const {
      style,
      className,
      list,
      multiple,
      size,
      initialValues,
      loading,
      onSearch,
      onReset,
      onExport,
      extra,
      searchText,
      resetText,
      exportText,
      collapseText,
      uncollapseText,
    } = this.props;
    const { collapsed } = this.state;

    if (list.length === 0) {
      return null;
    }

    return (
      <Form
        className={className}
        style={style}
        layout="inline"
        ref={this.props.formRef}
        initialValues={initialValues}
        onFinish={onSearch}
      >
        {this.listRender()}
        <Form.Item aria-label="action">
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            aria-label="search"
          >
            {searchText}
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            disabled={loading}
            onClick={onReset}
            aria-label="reset"
          >
            {resetText}
          </Button>
          {
            onExport && (
              <Button
                style={{ marginLeft: 8 }}
                disabled={loading}
                onClick={onExport}
                aria-label="export"
              >
                {exportText}
              </Button>
            )
          }
          {
            multiple && list.length > size && (
              <Button style={{ marginLeft: 8 }} onClick={this.onCollapse}>
                <span>{collapsed ? collapseText : uncollapseText }</span>
                { collapsed ? <CaretDownOutlined /> : <CaretUpOutlined /> }
              </Button>
            )
          }
          {extra && <>{extra}</>}
        </Form.Item>
      </Form>
    );
  }
}

export default SearchForm;
