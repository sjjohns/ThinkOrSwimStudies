#
# Copyright 2021 Scott J. Johnson (https://scottjjohnson.com)
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
# TwelveOfFifteenUp
#
# Adds a wedge on top of a candle where closing price was higher than the
# previous candle for 12 of 15 candles (the current candle
# plus the previous 14 candles.)
#
declare upper;

input lookbackPeriod = 15;
input minimumDaysUp = 12;

def priceUp = fold i = 0 to lookbackPeriod with count do count + if getValue(close, i, lookbackPeriod - 1) > getValue(close, i + 1, lookbackPeriod) then 1 else 0;

plot upPlot = priceUp >= minimumDaysUp;
upPlot.setDefaultColor(Color.Yellow);
upPlot.setPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);
upPlot.setStyle(Curve.Points);
