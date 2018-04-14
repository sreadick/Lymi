import React from 'react';

export const TopicPagination = (props) => (
  <div className={`forum-topic__pagination ${props.position === 'bottom' && 'forum-topic__pagination--bottom'}`}>
    <div
      className={`forum-topic__pagination__nav-text valign-wrapper ${props.topicListGroup !== 1 ? '' : 'disabled'}`}
      onClick={() => {
        if (props.topicListGroup !== 1) {
          // this.setState({topicListGroup: props.topicListGroup - 1})
          props.changeTopicListGroup(props.topicListGroup - 1);
        }
      }}>
      <i className='material-icons'>chevron_left</i>

      <span>Previous</span>
    </div>
    {/* {props.topics.length > 10 ? */}
    <span>
      {/* {[...Array(Math.ceil(props.topics.length / 10)).keys()].map(num => */}
      {[...Array(props.totalTopicListGroups).keys()].map(num =>
        <span
          key={num}
          className={`forum-topic__pagination__number ${props.topicListGroup === num + 1 && 'active'}`}
          // onClick={() => this.setState({topicListGroup: num + 1})}>
          onClick={() => props.changeTopicListGroup(num + 1)}>
          {num + 1}
        </span>
      )}
    </span>
      {/* <span className='forum-topic__pagination__number active'>1</span> */}
    <div
      className={`forum-topic__pagination__nav-text valign-wrapper ${props.topicListGroup < props.totalTopicListGroups ? '' : 'disabled'}`}
      onClick={() => {
        if (props.topicListGroup < props.totalTopicListGroups) {
          // this.setState({topicListGroup: props.topicListGroup + 1})
          props.changeTopicListGroup(props.topicListGroup + 1);
        }
      }}>
      <span>Next</span>
      <i className='material-icons'>chevron_right</i>
    </div>
  </div>
)
