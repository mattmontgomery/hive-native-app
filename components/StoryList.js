import React, { PureComponent } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";

import { getStories } from "../reducers/HiveReducer";

class StoryList extends PureComponent {
  static defaultProps = {
    offset: 0,
    limit: 40,
    refreshing: false
  };
  constructor(props) {
    super(props);
    this.handleRefresh = (...args) => this._handleRefresh(...args);
    /**
     * @TODO Debounce this
     */
    this.handleSearch = (...args) => this._handleSearch(...args);
    this.handleInfiniteScroll = (...args) =>
      this._handleInfiniteScroll(...args);
  }
  componentDidMount() {
    this.props.getStories({});
  }
  _handleRefresh() {
    this.props.getStories({
      refreshing: true,
      searchValue: this.props.searchValue,
      offset: 0
    });
  }
  _handleSearch(searchValue) {
    this.listRef.getScrollResponder().scrollTo({ x: 0, y: 0 });
    this.props.getStories({ refreshing: true, searchValue });
  }
  _handleInfiniteScroll() {
    this.props.getStories({
      refreshing: true,
      searchValue: this.props.searchValue,
      offset: (this.props.offset += this.props.limit)
    });
  }
  renderStatus(status, importPending = false) {
    switch (`${status}-${importPending}`) {
      case "live-false":
        return <Icon name="circle" type="font-awesome" color="#090" />;
      case "live-true":
        return <Icon name="circle-o" type="font-awesome" color="#090" />;
      case "draft-false":
        return <Icon name="circle" type="font-awesome" color="#fa0" />;
      case "draft-true":
        return <Icon name="circle-o" type="font-awesome" color="#fa0" />;
      default:
        return <Text style={styles.itemText}>{status}</Text>;
    }
  }
  renderType(contentType) {
    switch (contentType) {
      case "story":
        return (
          <View style={styles.typeIcon}>
            <Icon name="note" type="octicon" />
          </View>
        );
      default:
        return <Text style={styles.itemText}>{contentType}</Text>;
    }
  }
  /**
   * @TODO Convert Hive's StatusLight into a separate module that can be included?
   */
  renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemInner}>
        {this.renderType(item.content_type)}
        <Text style={styles.itemTitleText}>{item.content_data.title}</Text>
        {this.renderStatus(item.status, item.content_data.import_pending)}
      </View>
      <View style={styles.itemInner}>
        {item.content_data.import_pending ? (
          <Text style={styles.importPending}>{"Import Pending"}</Text>
        ) : null}
      </View>
    </View>
  );
  render() {
    const { stories } = this.props;
    return (
      <View>
        <SearchBar
          lightTheme
          round
          showLoading
          onChangeText={this.handleSearch}
        />
        <FlatList
          onEndReachedThreshold={0.825}
          onEndReached={this.handleInfiniteScroll}
          onRefresh={this.handleRefresh}
          refreshing={this.props.refreshing}
          styles={styles.container}
          data={stories}
          renderItem={this.renderItem}
          ref={ref => {
            this.listRef = ref;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  itemInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    alignItems: "center"
  },
  itemText: {
    marginRight: 10
  },
  itemTitleText: {
    marginRight: 10,
    flex: 1
  },
  typeIcon: {
    marginRight: 10
  },
  importPending: {
    fontWeight: "bold",
    color: "#fa0"
  }
});

const mapStateToProps = state => {
  // let storedRepositories = state.repos.map(repo => ({ key: repo.id, ...repo }));
  return {
    limit: state.HiveReducer.limit,
    offset: state.HiveReducer.offset,
    refreshing: state.HiveReducer.refreshing,
    searchValue: state.HiveReducer.searchValue,
    stories: state.HiveReducer.stories.map(contentProfile => ({
      key: contentProfile.id,
      ...contentProfile
    }))
  };
};

const mapDispatchToProps = {
  getStories
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryList);
