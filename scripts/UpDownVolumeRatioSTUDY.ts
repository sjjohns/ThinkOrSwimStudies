#
# Copyright 2014 Scott J. Johnson (http://scottjjohnson.com)
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
# UpDownVolumeRatio
#
# Ratio of the volume on up days versus down days. Higher numbers indicate
# more accumulation by large investors which is a positive.  Low numbers 
# indicate distribution.  Generally, don't open a position if the current
# ratio is less than 1.0.
#
input Period = 50;
input MinimumUDVolumeForBuy = 1.00;

def Up = If(close > close[1], volume, 0);
def Down = If(close <= close[1], volume, 0);
def UpAvgVol = MovingAverage(AverageType.SIMPLE, Up, Period);
def DownAvgVol = MovingAverage(AverageType.SIMPLE, Down, Period);

plot UpDownVol = Round(UpAvgVol / DownAvgVol, 2);

UpDownVol.AssignValueColor(Color.CYAN);
UpDownVol.SetLineWeight(3);

# this line represents the minimum U/D Volume for a buy
plot MinUDVolLine = MinimumUDVolumeForBuy;
MinUDVolLine.AssignValueColor(Color.WHITE);
MinUDVolLine.SetLineWeight(2);
MinUDVolLine.HideBubble();