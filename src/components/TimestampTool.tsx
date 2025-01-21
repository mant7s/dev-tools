'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react';
import { BiTime } from 'react-icons/bi';
import { MdContentCopy } from 'react-icons/md';
import { IoCheckmark } from 'react-icons/io5';
import { FaUndo, FaRedo } from 'react-icons/fa';

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentTime.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((currentTime.getMonth() + 1).toString().padStart(2, '0'));
  const [selectedDay, setSelectedDay] = useState(currentTime.getDate().toString().padStart(2, '0'));
  const [selectedHour, setSelectedHour] = useState(currentTime.getHours().toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(currentTime.getMinutes().toString().padStart(2, '0'));
  const [selectedSecond, setSelectedSecond] = useState(currentTime.getSeconds().toString().padStart(2, '0'));

  // 生成年份选项（前后 100 年）
  const years = Array.from({ length: 201 }, (_, i) => (currentTime.getFullYear() - 100 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期
  const timestampToDate = (ts: string) => {
    if (!ts) return;
    
    const timestamp = parseInt(ts);
    if (isNaN(timestamp)) return;

    // 处理毫秒和秒
    const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
    if (date.toString() === 'Invalid Date') return;

    setDateString(date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }));
  };

  // 日期转时间戳
  const updateTimestamp = () => {
    const dateStr = `${selectedYear}-${selectedMonth}-${selectedDay}T${selectedHour}:${selectedMinute}:${selectedSecond}`;
    const timestamp = new Date(dateStr).getTime();
    if (!isNaN(timestamp)) {
      setTimestamp(timestamp.toString());
    }
  };

  // 当任何日期时间组件改变时更新时间戳
  useEffect(() => {
    updateTimestamp();
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute, selectedSecond]);

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="flex flex-col gap-6">
          {/* 工具栏 */}
          <div className="flex items-center justify-between">
            <ButtonGroup size="sm" variant="flat">
              <Tooltip content="撤销" placement="top">
                <Button
                  isIconOnly
                  isDisabled={false}
                  onClick={() => {}}
                >
                  <FaUndo className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="重做" placement="top">
                <Button
                  isIconOnly
                  isDisabled={false}
                  onClick={() => {}}
                >
                  <FaRedo className="h-4 w-4" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：时间戳转换 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">当前时间</h3>
                <div className="flex flex-col gap-4">
                  <Input
                    label="时间戳（毫秒）"
                    value={currentTime.getTime().toString()}
                    readOnly
                    variant="bordered"
                  />
                  <Input
                    label="时间戳（秒）"
                    value={Math.floor(currentTime.getTime() / 1000).toString()}
                    readOnly
                    variant="bordered"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">时间戳转换</h3>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Unix 时间戳"
                    placeholder="请输入 Unix 时间戳..."
                    value={timestamp}
                    onChange={(e) => {
                      setTimestamp(e.target.value);
                      timestampToDate(e.target.value);
                    }}
                    startContent={
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={() => {
                          const now = Math.floor(Date.now() / 1000);
                          setTimestamp(now.toString());
                          timestampToDate(now.toString());
                        }}
                      >
                        <BiTime className="text-default-400" />
                      </Button>
                    }
                  />

                  <Input
                    label="日期时间"
                    type="text"
                    value={dateString}
                    readOnly
                    variant="bordered"
                  />
                </div>
              </div>
            </div>

            {/* 右侧：日期时间转换 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">日期时间转换</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Select
                    label="年"
                    selectedKeys={[selectedYear]}
                    onChange={e => setSelectedYear(e.target.value)}
                    variant="bordered"
                  >
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="月"
                    selectedKeys={[selectedMonth]}
                    onChange={e => setSelectedMonth(e.target.value)}
                    variant="bordered"
                  >
                    {months.map(month => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="日"
                    selectedKeys={[selectedDay]}
                    onChange={e => setSelectedDay(e.target.value)}
                    variant="bordered"
                  >
                    {days.map(day => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Select
                    label="时"
                    selectedKeys={[selectedHour]}
                    onChange={e => setSelectedHour(e.target.value)}
                    variant="bordered"
                  >
                    {hours.map(hour => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="分"
                    selectedKeys={[selectedMinute]}
                    onChange={e => setSelectedMinute(e.target.value)}
                    variant="bordered"
                  >
                    {minutes.map(minute => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="秒"
                    selectedKeys={[selectedSecond]}
                    onChange={e => setSelectedSecond(e.target.value)}
                    variant="bordered"
                  >
                    {seconds.map(second => (
                      <SelectItem key={second} value={second}>
                        {second}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-default-500">转换结果（毫秒）</p>
                  <div className="flex gap-2">
                    <Input
                      value={timestamp}
                      readOnly
                      variant="bordered"
                    />
                    <Button
                      isIconOnly
                      variant="flat"
                      color="primary"
                      onClick={() => copyToClipboard(timestamp)}
                    >
                      {copied ? <IoCheckmark /> : <MdContentCopy />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
