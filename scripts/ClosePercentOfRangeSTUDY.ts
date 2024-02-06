#
# Copyright 2017 Scott J. Johnson (https://scottjjohnson.com)
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
# Calculates where in the time period range the stock closed. This study does
# not consider prior close as with True Range. If the close percent of range
# is greater than or equal to the threshold value, the bar is shown in Green
# instead of Red.
#
declare lower;
input thresholdPercent = 38;

def todaysClosePctRange = (close - low) / (high - low) * 100;

plot ClosePctOfRange = todaysClosePctRange;
ClosePctOfRange.AssignValueColor(if todaysClosePctRange >= thresholdPercent then Color.GREEN else Color.RED);
ClosePctOfRange.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
