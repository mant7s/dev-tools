'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { BiTime } from 'react-icons/bi';
import { MdContentCopy } from 'react-icons/md';
import { IoCheckmark } from 'react-icons/io5';

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 生成年份选项（前后 100 年）
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => (currentYear - 100 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedDay, setSelectedDay] = useState('01');
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedSecond, setSelectedSecond] = useState('00');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const date = new Date(
      parseInt(selectedYear),
      parseInt(selectedMonth) - 1,
      parseInt(selectedDay),
      parseInt(selectedHour),
      parseInt(selectedMinute),
      parseInt(selectedSecond)
    );
    setTimestamp(date.getTime().toString());
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute, selectedSecond]);

  const timestampToDate = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setDateString('');
      return;
    }

    // 判断是秒还是毫秒
    const timestamp = numValue < 10000000000 ? numValue * 1000 : numValue;
    const date = new Date(timestamp);
    if (date.toString() === 'Invalid Date') {
      setDateString('');
      return;
    }

    setDateString(date.toLocaleString());
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <Card className="bg-content1 shadow-md">
      <CardBody className="p-6">
        <div className="flex flex-col gap-6">
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
                    endContent={
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={() => copyToClipboard(currentTime.getTime().toString())}
                      >
                        {copied ? <IoCheckmark className="text-success" /> : <MdContentCopy />}
                      </Button>
                    }
                  />
                  <Input
                    label="时间戳（秒）"
                    value={Math.floor(currentTime.getTime() / 1000).toString()}
                    readOnly
                    variant="bordered"
                    endContent={
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={() => copyToClipboard(Math.floor(currentTime.getTime() / 1000).toString())}
                      >
                        {copied ? <IoCheckmark className="text-success" /> : <MdContentCopy />}
                      </Button>
                    }
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
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium">转换结果（毫秒）</label>
                  <Input
                    value={timestamp}
                    readOnly
                    variant="bordered"
                    endContent={
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={() => copyToClipboard(timestamp)}
                      >
                        {copied ? <IoCheckmark className="text-success" /> : <MdContentCopy />}
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
