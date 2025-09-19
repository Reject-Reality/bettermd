import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Input, Button, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 模拟笔记数据
const mockNotes = [
  { id: 1, title: '项目规划', content: '这是关于项目规划的笔记内容...', links: [2, 3] },
  { id: 2, title: '技术选型', content: '这是关于技术选型的笔记内容...', links: [1, 4] },
  { id: 3, title: '需求分析', content: '这是关于需求分析的笔记内容...', links: [1, 5] },
  { id: 4, title: '架构设计', content: '这是关于架构设计的笔记内容...', links: [2] },
  { id: 5, title: '用户调研', content: '这是关于用户调研的笔记内容...', links: [3] },
];

const BacklinkNote = ({ note, onNoteSelect }) => {
  const linkedNotes = mockNotes.filter(n => note.links.includes(n.id));
  
  return (
    <Card 
      title={note.title}
      extra={<Button onClick={() => onNoteSelect(note)}>查看</Button>}
      style={{ marginBottom: 16 }}
    >
      <Text ellipsis>{note.content}</Text>
      {linkedNotes.length > 0 && (
        <>
          <Title level={5} style={{ marginTop: 12 }}>双向链接:</Title>
          <List
            size="small"
            dataSource={linkedNotes}
            renderItem={item => (
              <List.Item>
                <Button type="link" onClick={() => onNoteSelect(item)}>
                  {item.title}
                </Button>
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );
};

const BacklinkPanel = ({ currentNote, onNoteSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(mockNotes);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(mockNotes);
    }
  }, [searchTerm]);

  // 找到当前笔记的反向链接
  const backlinks = mockNotes.filter(note => 
    note.links.includes(currentNote?.id) && note.id !== currentNote?.id
  );

  return (
    <Card title="知识网络" style={{ height: '100%' }}>
      <Input
        placeholder="搜索笔记..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      
      {backlinks.length > 0 && (
        <>
          <Title level={5}>反向链接:</Title>
          <List
            dataSource={backlinks}
            renderItem={note => (
              <List.Item>
                <Button type="link" onClick={() => onNoteSelect(note)}>
                  {note.title}
                </Button>
              </List.Item>
            )}
          />
          <Divider />
        </>
      )}
      
      <Title level={5}>所有笔记:</Title>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <List
          dataSource={filteredNotes}
          renderItem={note => (
            <BacklinkNote note={note} onNoteSelect={onNoteSelect} />
          )}
        />
      </div>
    </Card>
  );
};

export default BacklinkPanel;