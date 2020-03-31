#
# Copyright 2019 Scott J. Johnson (https://scottjjohnson.com)
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
# EarningsPerShare
#
# Displays the company's earnings per share over the time period. If overlaying
# this study on a price graph, right click the line and select "Use left axis" 
# to adjust the scale.
#
declare upper;

plot Data = getActualEarnings();
Data.SetPaintingStrategy(PaintingStrategy.LINE);
Data.SetLineWeight(2);
Data.SetDefaultColor(Color.LIGHT_ORANGE);
Data.EnableApproximation(); 
