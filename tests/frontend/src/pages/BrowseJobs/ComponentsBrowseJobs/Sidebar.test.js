import React from 'react';
import { shallow } from 'enzyme';
import SideBar from './SideBar';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { List } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

describe('SideBar Component', () => {
  const mockJobs = [
    {
      _id: '1',
      companyName: 'Company 1',
      position: 'Position 1',
      dateCreated: '2021-01-01',
    },
    {
      _id: '2',
      companyName: 'Company 2',
      position: 'Position 2',
      dateCreated: '2021-01-02',
    },
  ];

  it('renders correctly with props', () => {
    const wrapper = shallow(<SideBar jobs={mockJobs} OnJobClick={() => {}} />);
    expect(wrapper.find(Box)).toHaveLength(2);
    expect(wrapper.find(List)).toHaveLength(1);
    expect(wrapper.find(ListItem)).toHaveLength(mockJobs.length);
    expect(wrapper.find(ListItemText)).toHaveLength(mockJobs.length);
    expect(wrapper.find(Typography)).toHaveLength(1);
  });

  it('calls OnJobClick when a job is clicked', () => {
    const onJobClickMock = jest.fn();
    const wrapper = shallow(<SideBar jobs={mockJobs} OnJobClick={onJobClickMock} />);
    const listItem = wrapper.find(ListItem).at(0);
    listItem.simulate('click');
    expect(onJobClickMock).toHaveBeenCalled();
  });
});
