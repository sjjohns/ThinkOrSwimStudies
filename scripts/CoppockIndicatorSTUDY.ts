#
# Copyright 2016 Scott J. Johnson (https://scottjjohnson.com)
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
# CoppockIndicator
#
# Charts the Coppock Indicator described here: 
#             https://en.wikipedia.org/wiki/Coppock_curve
#
# The Coppock can be used (along with other indicators like the Eureka Signal
# and IBD6000 %Es) to identify points where the stock market trend changes 
# from down to up. The Coppock does not identify the beginning of downtrends.
#
# This study is designed to be applied to a major market index (e.g., SPX or
# COMP) with an aggregation period of weeks or months.
#
declare lower;

input RateOfChangeSlowPeriod = 14;
input RateOfChangeFastPeriod = 11;
input WeightedMAPeriod = 10;

def AggregationPeriod = if (getAggregationPeriod() < AggregationPeriod.WEEK) then AggregationPeriod.WEEK else getAggregationPeriod();

def price = close(period = AggregationPeriod);

def ROC1 = if price[RateOfChangeSlowPeriod]!=0 then (price/price[RateOfChangeSlowPeriod]-1)*100 else 0;
def ROC2 = if price[RateOfChangeFastPeriod]!=0 then (price/price[RateOfChangeFastPeriod]-1)*100 else 0;

plot Coppock = WMA(ROC1 + ROC2, WeightedMAPeriod);

Coppock.assignValueColor(if Coppock>Coppock[1] then color.green else color.red);
Coppock.SetDefaultColor(GetColor(1));
Coppock.setLineWeight(2);
Coppock.HideBubble();

plot ZeroLine = 0;

ZeroLine.SetDefaultColor(color.white);
ZeroLine.HideBubble();

AddChartBubble(Coppock[1] < 0 and Coppock > Coppock[1] and Coppock[1] < Coppock[2], Coppock, "Buy", Color.CYAN, no);
