#
# Copyright 2017 Scott J. Johnson (http://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# ClosePercentOfRange
# 
# Calculates where in the day's range the stock closed. For days with a gap up
# or down at the open, the previous day's close is considered the low/high,
# respectively. If the close percent of range is greater than or equals to
# the threshold value, the bar is shown in Green instead of Red.

declare lower;
input thresholdPercent = 50;

def todaysHigh = Max(high, close[1]);
def todaysLow = Min(low, close[1]);
def todaysRange = todaysHigh - todaysLow;
def todaysPctRange = (close - todaysLow) / (todaysHigh - todaysLow) * 100;

plot ClosePctOfRange = todaysPctRange;

ClosePctOfRange.AssignValueColor(if todaysPctRange >= thresholdPercent then Color.GREEN else Color.RED);

ClosePctOfRange.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
